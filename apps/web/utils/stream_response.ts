import fetch from 'node-fetch';

export async function performCompletion(res, body, inPlace = false) {
    const completion = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/completion`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json', 'X-API-KEY': process.env.NEXT_PUBLIC_API_ROUTE_SECRET },
    });
    if (body['stream']) {
        // Send an initial comment to establish the connection
        res.write(':ok\n\n');

        // Forward the data from the completion request to the client
        completion.body.on('data', chunk => {
            res.write(`data: ${chunk.toString('base64')}\n\n`);
        });
        // Handle completion request completion
        completion.body.on('end', () => {
            // Send a final chunk to the frontend that says [DONE]
            const doneMessage = Buffer.from('[DONE]').toString('base64');
            res.write(`data: ${doneMessage}\n\n`);
            // Close the SSE connection when the completion request is complete
            res.end();
        });
    }
    else {
        const response = await completion.text()
        if (inPlace) return response
        else res.end(response)
    }
}
