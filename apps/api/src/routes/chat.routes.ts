import { Router } from "express";
import { generateChatResponse } from "../ai/client";
import { db } from "../db";
import { workspaces } from "../db/schema";
import { eq } from "drizzle-orm";

const router = Router();

router.post("/", async (req, res) => {
    const { workspaceId, message } = req.body;

    if (!workspaceId || !message) {
        return res.status(400).json({ error: "workspaceId and message are required" });
    }

    try {
        // 1. Fetch current workspace messages
        const workspaceList = await db.select().from(workspaces).where(eq(workspaces.id, Number(workspaceId)));
        if (workspaceList.length === 0) {
            return res.status(404).json({ error: "Workspace not found" });
        }

        const workspace = workspaceList[0];
        let messages: any[] = [];
        try {
            messages = JSON.parse(workspace.messages);
        } catch (e) {
            messages = [];
        }

        // 2. Add User Message
        const userMsg = { role: "user", content: message };
        messages.push(userMsg);

        // 3. Generate AI Response
        const aiResponseText = await generateChatResponse(message);
        const aiMsg = { role: "ai", content: aiResponseText };
        messages.push(aiMsg);

        // 4. Update Database
        await db.update(workspaces)
            .set({ messages: JSON.stringify(messages) })
            .where(eq(workspaces.id, Number(workspaceId)));

        // 5. Return response
        res.json({ result: aiResponseText });

    } catch (error: any) {
        console.error("Chat generation failed:", error);
        res.status(500).json({ error: "Failed to generate chat response" });
    }
});

export default router;
