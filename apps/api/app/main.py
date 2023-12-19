# main.py
from fastapi import FastAPI, Depends, HTTPException, status, Request
from pydantic import BaseModel
from langchain.document_loaders import UnstructuredFileLoader
from unstructured.cleaners.core import clean_extra_whitespace
from langchain.text_splitter import RecursiveCharacterTextSplitter
import openai
import concurrent.futures
import stripe
from supabase import create_client
import requests
import re
import psycopg2
import json
from fastapi.middleware.cors import CORSMiddleware
import os
from fastapi.security.api_key import APIKeyHeader
from langchain.prompts import PromptTemplate
from fastapi.responses import StreamingResponse, PlainTextResponse, JSONResponse
from litellm import completion, embedding

# Environment variables
EMBEDDINGS_DATABASE_HOST = os.environ.get("EMBEDDINGS_DATABASE_HOST", "default_host")
EMBEDDINGS_DATABASE_NAME = os.environ.get("EMBEDDINGS_DATABASE_NAME", "default_database")
EMBEDDINGS_DATABASE_USER = os.environ.get("EMBEDDINGS_DATABASE_USER", "default_user")
EMBEDDINGS_DATABASE_PASSWORD = os.environ.get("EMBEDDINGS_DATABASE_PASSWORD", "default_password")
API_ROUTE_SECRET = os.environ.get("API_ROUTE_SECRET", "default-api-route-secret")
API_KEY_NAME = "X-API-KEY"
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)
openai.api_key = os.environ.get("OPENAI_API_KEY", "default-openai-api-key")
stripe.api_key = os.environ.get("STRIPE_SECRET_KEY", "default-stripe-api-key")



async def get_api_key(api_key_header: str = Depends(api_key_header)):
    print(f"Received API key: {api_key_header}")
    print(f"Expected API key: {API_ROUTE_SECRET}")
    if api_key_header and api_key_header == API_ROUTE_SECRET:
        return api_key_header
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials"
        )
origins = ["*"]

# Supported file extensions for unstructured data
supported_extensions = ['.docx', '.doc', '.odt', '.pptx', '.xlsx', '.csv', '.tsv',
                        '.eml', '.msg', '.rtf', '.epub', '.html', '.xml', '.pdf', '.png', '.jpg']


doi_regex = re.compile(r'10[.]\d{4,9}/[-._;()/:A-Z0-9]+', re.I)
arxiv_regex = re.compile(r'arXiv:[0-9]+[.][0-9]+v[0-9]+', re.I)

# Configure Supabase client
supabase_url = os.environ["SUPABASE_URL"]
supabase_key = os.environ["SUPABASE_KEY"]
supabase = create_client(supabase_url, supabase_key)

app = FastAPI(dependencies=[Depends(get_api_key)])

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class UploadDocumentRequest(BaseModel):
    uploadId: str
    userId: str


class CreateStripeCustomerRequest(BaseModel):
    id: str
    email: str


def getEmbeddingsForDocument(document):

    response = openai.Embedding.create(
        input=document.page_content,
        model="text-embedding-ada-002"
    )
    embeddings = response['data'][0]['embedding']
    return {"text": document.page_content,
            "embedding": embeddings,
            "metaData": document.metadata
            }


def concurrentParrallelGetEmbeddingsForDocument(documents):
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
        return [executor.submit(getEmbeddingsForDocument, doc) for doc in documents]


def getCitation(docs):
    first_page = [
        i.page_content for i in docs if i.metadata["page_number"] == 1]
    first_page = " ".join(first_page)
    prompt_template = PromptTemplate.from_template(
        """
  document:{document}

  Shape:
  title:$title 
  authors: $author(s)
  year: $year 

  Given the document, fill out the above template in json format?
  """
    )

    # Include the 'text' variable directly in the template
    formatted_prompt = prompt_template.template.format(document=first_page)

    completion = openai.ChatCompletion.create(
        model="gpt-4-1106-preview", messages=[{"role": "user", "content": formatted_prompt}])

    try:
        citation = json.loads(completion.choices[0].message.content)
        # ensure citation follows the correct format
        if not citation["title"] or not citation["year"] or not citation["authors"]:
            citation = {"title": "", "year": 0, "authors": []}
            return citation
        # make sure year is an integer
        citation["year"] = int(citation["year"])
        if len(str(citation["year"])) != 4:
            citation = {"title": "", "year": 0, "authors": []}
            return citation
        return citation
    except Exception as e:
        citation = {"title": "", "year": 0, "authors": []}
        return citation


def process_docs(docs, citation, max_length=1000):
    if len(docs) == 0:
        return docs
    if len(docs) == 1:
        docs[0].metadata["citation"] = citation
        return docs
    merged_documents = []
    current_merged_doc = docs[0]

    # Iterate through the documents
    for doc in docs[1:]:
        page_content = doc.page_content

        # Check if merging the current document with the existing merged document exceeds the specified max_length
        if len(current_merged_doc.page_content) + len(page_content) > max_length or doc.metadata["page_number"] != current_merged_doc.metadata["page_number"]:
            # If it exceeds, add the current merged document to the list and start a new one
            current_merged_doc.metadata["citation"] = citation
            merged_documents.append(current_merged_doc)
            current_merged_doc = doc
        else:
            current_merged_doc.page_content = current_merged_doc.page_content + " " + page_content

    current_merged_doc.metadata["citation"] = citation
    # Append the last merged document to the list
    merged_documents.append(current_merged_doc)

    return merged_documents


def getLangchainDocsFromFile(file_location, filename):

    with open(filename, 'wb+') as f:
        res = supabase.storage.from_("user-uploads").download(file_location)
        f.write(res)
    loader = UnstructuredFileLoader(filename,
                                    mode="elements",
                                    strategy="fast")

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=2000,
        chunk_overlap=100,
        length_function=len,
        add_start_index=True,
        separators=["\n\n", "\n", " ", ""]
    )

    docs = loader.load_and_split(text_splitter)
    citation = getCitation(docs)
    # add citation to supabase

    docs = process_docs(docs, citation)
    os.remove(filename)
    return docs


@app.get("/")
def read_root():
    return {"message": "Welcome to FastAPI1"}


@app.post("/api/upload_document")
async def create_item(req: UploadDocumentRequest):
    try:
        print("Received upload document request")

        userId = req.userId
        print(f"User ID: {userId}")

        uploadID = req.uploadId
        print(f"Upload ID: {uploadID}")

        filePath = userId + "/" + uploadID
        print(f"File Path: {filePath}")

        response = supabase.table("uploads").select(
            "file_name").eq("id", uploadID).execute()
        fileName = response.data[0]["file_name"]
        print(f"File Name: {fileName}")

        if not fileName or len(fileName) < 2:
            raise HTTPException(
                status_code=404, detail="No valid file name found")

        docs = getLangchainDocsFromFile(filePath, fileName)
        print(f"Docs retrieved: {len(docs)}")

        if len(docs) == 0 or (len(docs) > 0 and docs[0].page_content == ""):
            supabase.table('uploads').update(
                {'status': 'error'}
            ).eq("id", uploadID).execute()
            raise HTTPException(
                status_code=404, detail="No valid documents found")

        citation = docs[0].metadata["citation"]
        data, count = supabase.table('uploads').update(
            {'custom_citation': citation, 'status': 'processed'}).eq('id', uploadID).execute()
        print("Citation updated in database")

        pageIndex = 0
        identifier = None
        while (not identifier and pageIndex < len(docs)):
            pageContent = docs[pageIndex].page_content
            print(f"Checking page {pageIndex} for identifiers")

            arxiv_match = arxiv_regex.search(pageContent)
            doi_match = doi_regex.search(pageContent)

            identifier = arxiv_match.group(0) if arxiv_match else (
                doi_match.group(0) if doi_match else None)

            pageIndex += 1

        if identifier:
            print(f"Identifier found: {identifier}")
            await fetch_citation(identifier, uploadID)

        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=2000, chunk_overlap=20, length_function=len,
            separators=["\n\n", "\n", " ", ""]
        )

        texts = text_splitter.split_documents(docs)
        print(f"Texts split into {len(texts)} parts")

        embeddingFutures = concurrentParrallelGetEmbeddingsForDocument(texts)
        embeddings = []
        for embeddingFuture in embeddingFutures:
            embeddings.append(embeddingFuture.result(5))
        print(f"Embeddings obtained: {len(embeddings)}")

        conn = psycopg2.connect(
            host=EMBEDDINGS_DATABASE_HOST,
            database=EMBEDDINGS_DATABASE_NAME,
            user=EMBEDDINGS_DATABASE_USER,
            password=EMBEDDINGS_DATABASE_PASSWORD
        )
        cursor = conn.cursor()

        delete_sql = """
        DELETE FROM document_embeddings
        WHERE upload_id = %s
        """
        upload_id_str = str(uploadID)
        cursor.execute(delete_sql, (upload_id_str,))
        print("Deleted old embeddings from database")

        for embedding_entry in embeddings:
            text = embedding_entry["text"]
            embedding = embedding_entry["embedding"]
            metadata = embedding_entry["metaData"]

            insert_sql = """
            INSERT INTO document_embeddings (content, embedding, metadata, upload_id)
            VALUES (%s, %s, %s, %s)
            """

            embedding_json = json.dumps(embedding)
            metadata_json = json.dumps(metadata)

            cursor.execute(insert_sql, (text, embedding_json, metadata_json, upload_id_str))
            conn.commit()
            print("Inserted new embedding into database")

        cursor.close()
        conn.close()
        print("Database connection closed")
        return {"message": "Successfully uploaded document to database!"}
    except Exception as e:
        print(f"Error occurred: {e}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")


@app.post("/api/create_stripe_customer")
async def create_stripe_customer(request_data: CreateStripeCustomerRequest):
    try:
        # Create a Stripe customer
        customer = stripe.Customer.create(
            email=request_data.email
        )

        # Update Supabase record with Stripe customer ID
        update_result = supabase.table('profile').update(
            {
                'stripe_customer': customer.id,
            }
        ).eq(
            "id", request_data.id,
        ).execute()

        if not hasattr(update_result, 'data'):
            raise HTTPException(
                status_code=500, detail="Failed to update Supabase record")

        return {"message": "Stripe customer created and Supabase record updated successfully"}
    except stripe.error.StripeError as e:
        # Handle Stripe API errors
        raise HTTPException(status_code=500, detail=str(e))


async def fetch_citation(identifier, uploadID):
    try:
        # Make an API request to fetch citations
        response = requests.get(
            f"https://api.citeas.org/product/{identifier}?email=eimen@aietal.com")

        if not response.ok:
            raise HTTPException(
                status_code=500, detail=f"Fetching citations for {identifier} failed. Response status: {response.status_code}")

        data = response.json()

        # Update Supabase record with citation
        update_result = await supabase.table('uploads').update(
            {
                'citation': data,
            }
        ).eq(
            id, uploadID,
        )

        if update_result.error:
            raise HTTPException(
                status_code=500, detail=f"Updating upload with citation failed: {uploadID}")

        return {"message": f"Citations fetched and uploaded successfully for upload ID: {uploadID}"}

    except Exception as e:
        # Handle errors
        return

litellm_fallback_models = ['gpt-4', 'gpt-3.5-turbo']

async def stream_response(response):
    for chunk in response:
        chunk_content = chunk['choices'][0]['delta'].get('content', '')
        if chunk_content is not None:
            yield chunk['choices'][0]['delta'].get('content', '')

@app.post("/api/completion")
async def read_root(request: Request):
    try:
        request_body = await request.body()
        body_dict = json.loads(request_body.decode('utf-8'))
        body_dict['fallbacks'] = litellm_fallback_models
        if 'stream' not in body_dict:
            body_dict['stream'] = False
        response_litellm = completion(**body_dict)
        if body_dict['stream'] == True:
            return StreamingResponse(stream_response(response_litellm), media_type='text/plain')
        non_streaming_response = response_litellm['choices'][0].get('message').get('content', "")
        if non_streaming_response is not None:
            return PlainTextResponse(content=non_streaming_response)
        return PlainTextResponse(content="")
    except Exception as e:
        print(f"Error occurred: {e}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")

@app.post("/api/embedding")
async def create_embedding(request: Request):
    try:
        request_body = await request.body()
        body_dict = json.loads(request_body.decode('utf-8'))
        response_litellm = embedding(**body_dict)
        non_streaming_response = response_litellm.data[0].embedding
        if non_streaming_response is not None:
            return JSONResponse(content=non_streaming_response)
        return JSONResponse(content=[])
    except Exception as e:
        print(f"Error occurred: {e}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")
