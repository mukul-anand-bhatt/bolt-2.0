import { Router } from "express";
import { db } from "../db";
import { workspaces } from "../db/schema";
import { eq } from "drizzle-orm";

const router = Router();

// Get messages by workspace ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.select({
            messages: workspaces.messages
        }).from(workspaces).where(eq(workspaces.id, Number(id)));

        if (result.length > 0) {
            res.status(200).json(result[0].messages); // Returns { messages: "..." } directly
        } else {
            res.status(404).json({ error: "Workspace not found" });
        }
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Failed to fetch messages" });
    }
});

export default router;




