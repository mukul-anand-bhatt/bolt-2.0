import { Router } from "express";
import { generateCustom } from "../ai/client";

const router = Router();

router.post("/", async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
    }

    try {
        const result = await generateCustom(prompt);
        console.log("----->", result)
        res.json({ result: result }); // Return JSON string or object depending on what AI sends.
    } catch (error: any) {
        console.error("Custom generation failed:", error);
        res.status(500).json({ error: "Failed to generate content" });
    }
});

export default router;
