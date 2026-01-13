import { Router } from "express";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

const router = Router();

router.post("/", async (req, res) => {
    const { user } = req.body;

    if (!user?.email) {
        res.status(400).json({ error: "Email is required" });
        return;
    }

    try {
        // Check if user exists
        const existingUser = await db.select().from(users).where(eq(users.email, user.email));

        if (existingUser.length === 0) {
            // Create new user
            const result = await db.insert(users).values({
                name: user.name,
                email: user.email,
                picture: user.picture
            }).returning();
            res.json(result[0]);
        } else {
            res.json(existingUser[0]);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create user" });
    }
});


export default router;
