import { Router } from "express";
import { db } from "../db";
import { workspaces } from "../db/schema";
import { eq, desc } from "drizzle-orm";

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


router.get("/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        // Fetch workspaces for the user
        const result = await db.select()
            .from(workspaces)
            .where(eq(workspaces.user, userId))
            .orderBy(desc(workspaces.id));


        res.json(result);
    } catch (error) {
        console.error("Error fetching workspaces:", error);
        res.status(500).json({ error: "Failed to fetch workspaces" });
    }
});

export default router;
