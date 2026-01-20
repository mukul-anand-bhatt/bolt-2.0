// To run this code you need to install the following dependencies:
// npm install @google/genai mime

const { GoogleGenAI } = require('@google/generative-ai');

async function main() {
    const ai = new GoogleGenAI({
        apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
    });

    const chatConfig = {
        thinkingConfig: {
            thinkingBudget: -1,
        },
        responseMimeType: 'text/plain',
    };

    const codeConfig = {
        thinkingConfig: {
            thinkingBudget: -1,
        },
        responseMimeType: 'application/json',
    };

    const model = 'gemini-2.5-pro';

    const contents = [
        {
            role: 'user',
            parts: [
                {
                    text: `INSERT_INPUT_HERE`,
                },
            ],
        },
    ];

    const response = await ai.models.generateContentStream({
        model,
        chatConfig,
        contents,
    });

    const codeResponse = await ai.models.generateContentStream({
        model,
        codeConfig,
        contents,
    })

    for await (const chunk of response) {
        console.log(chunk.text);
    }

    for await (const chunk of codeResponse) {
        console.log(chunk.text);
    }
}

main();