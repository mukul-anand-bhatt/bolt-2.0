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


// Get workspace by ID or User Email
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (id.includes("@")) {
            // It's a User Email -> Fetch list
            const result = await db.select()
                .from(workspaces)
                .where(eq(workspaces.user, id))
                .orderBy(desc(workspaces.id));
            res.json(result);
        } else {
            // It's a Workspace ID -> Fetch single
            const workspaceId = Number(id);
            if (isNaN(workspaceId)) {
                return res.status(400).json({ error: "Invalid workspace ID" });
            }

            const result = await db.select()
                .from(workspaces)
                .where(eq(workspaces.id, workspaceId));

            if (result.length > 0) {
                res.json(result[0]);
            } else {
                res.status(404).json({ error: "Workspace not found" });
            }
        }
    } catch (error) {
        console.error("Error fetching workspace(s):", error);
        res.status(500).json({ error: "Failed to fetch workspace data" });
    }
});

export default router;
