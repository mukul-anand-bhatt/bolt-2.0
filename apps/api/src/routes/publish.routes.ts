import { Router } from "express";
import path from "path";
import fs from "fs";
import { uploadDirectoryToS3 } from "../aws/uploadToS3";
import { invalidateProject } from "../aws/cloudfront";
import { getFiles } from "../store/files.store";
import { buildProject } from "../build/buildProject";

const router = Router();

router.post("/", async (req, res) => {
    const { projectId } = req.body;
    console.log("🚀 ~ projectId:", projectId)

    if (!projectId) {
        return res.status(400).json({ error: "projectId required" });
    }

    const files = getFiles(projectId);

    if (!files || files.length === 0) {
        return res.status(400).json({ error: "No files found for this project" });
    }

    try {
        // 1. Build
        const buildRoot = await buildProject(projectId, files);
        console.log("🚀 ~ buildRoot:", buildRoot)

        const distPath = path.join(buildRoot, "dist");
        console.log("🚀 ~ distPath:", distPath)

        if (!fs.existsSync(distPath)) {
            throw new Error("dist folder not found after build");
        }

        // 2. Upload
        await uploadDirectoryToS3(distPath, projectId);
        console.log("🚀 ~ uploadDirectoryToS3:", uploadDirectoryToS3)

        // 3. Invalidate CDN
        await invalidateProject(projectId);
        console.log("🚀 ~ invalidateProject:", invalidateProject)

        // 4. Return URL
        const url = `https://${process.env.CLOUDFRONT_DOMAIN}/projects/${projectId}/`;
        console.log("🚀 ~ url:", url)

        res.json({ url });
    } catch (err) {
        console.error("Publish failed:", err);
        res.status(500).json({ error: "Publish failed" });
    }
});

export default router;
