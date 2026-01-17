import { Router } from "express";
import { generateFromPrompt } from "../ai/client";
import { validateGeneratedFiles } from "../ai/validate";
import { saveFiles } from "../store/files.store";

const router = Router();

router.post("/", async (req, res) => {
    const { projectId, prompt } = req.body;

    if (!projectId || !prompt) {
        return res.status(400).json({
            error: "projectId and prompt are required",
        });
    }

    try {
        const raw = await generateFromPrompt(prompt);

        if (!raw) {
            throw new Error("Empty AI response");
        }

        const files = JSON.parse(raw);


        validateGeneratedFiles(files);


        saveFiles(projectId, files);


        res.json({ files });
    } catch (err: any) {
        console.error("AI generation failed:", err.message);

        res.status(500).json({
            error: "Failed to generate project files",
        });
    }
});

export default router;
