export default async function handler(request, response) {
    if (request.method !== "POST") {
        return response.status(405).json({
            error: "Method not allowed"
        });
    }

    try {
        const { message } = request.body;

        if (!message || !message.trim()) {
            return response.status(400).json({
                error: "Message is required"
            });
        }

        const aiResponse = await fetch(
            "https://api.openai.com/v1/responses",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-5-mini",
                    input: message
                })
            }
        );

        const data = await aiResponse.json();

        if (!aiResponse.ok) {
            return response.status(aiResponse.status).json({
                error: data.error?.message || "AI request failed"
            });
        }

        return response.status(200).json({
            reply: data.output_text
        });

    } catch (error) {
        return response.status(500).json({
            error: "Something went wrong"
        });
    }
}
