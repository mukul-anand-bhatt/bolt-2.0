import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_PROMPT } from "./prompt";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// In Gemini, System Instructions are usually defined at the model level
const model = genAI.getGenerativeModel({
    model: "gemini-3.0-flash-exp",
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