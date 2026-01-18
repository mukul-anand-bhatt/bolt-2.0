import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_PROMPT, CHAT_PROMPT } from "./prompt";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// In Gemini, System Instructions are usually defined at the model level
const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: SYSTEM_PROMPT,
});

export async function generateFromPrompt(prompt: string) {
    const result = await model.generateContent({
        contents: [
            {
                role: "user",
                parts: [{ text: prompt }],
            },
        ],
        generationConfig: {
            temperature: 0.2,
        },
    });

    return result.response.text();
}

const chatModel = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: CHAT_PROMPT,
});

export async function generateChatResponse(message: string) {
    const result = await chatModel.generateContent({
        contents: [
            {
                role: "user",
                parts: [{ text: message }],
            },
        ],
    });

    return result.response.text();
}