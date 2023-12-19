export async function createEmbedding(body) {
    const embedding = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/embedding`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.NEXT_PUBLIC_API_ROUTE_SECRET },
    });
    const response = await embedding.json()
    return response
}
