import { Router } from "express";
import { db } from "../db";
import { workspaces } from "../db/schema";

const router = Router();

router.post("/", async (req, res) => {
    try {
        const { user, messages, fileData } = req.body;

        // Validation - Fail Fast
        if (!user || !messages) {
            res.status(400).json({ error: "User and messages are required" });
            return;
        }

        // Insert into database
        const result = await db.insert(workspaces).values({
            user,
            messages,
            fileData,
        }).returning();

        res.status(201).json(result[0]);

    } catch (error) {
        console.error("Error creating workspace entry:", error);
        res.status(500).json({ error: "Failed to save workspace data" });
    }
});

export default router;
