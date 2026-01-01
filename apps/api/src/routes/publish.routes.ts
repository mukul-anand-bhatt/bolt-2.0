import { Router } from "express";
import path from "path";
import fs from "fs";
import { execSync } from "child_process";
import { uploadDirectoryToS3 } from "../publish/uploadToS3";
import { getFiles } from "../store/files.store";

const router = Router();


router.post("/", async (req, res) => {
    const { projectId } = req.body;
    console.log("projectId", projectId);
    if (!projectId) {
        return res.status(400).json({ error: "Project ID is required" });
    }

    const files = getFiles(projectId);
    console.log("files", files);
    if (!files || files.length === 0) {
        return res.status(400).json({ error: "No files found for this project" });
    }

    const buildRoot = path.join(process.cwd(), ".build", projectId);
    const srcDir = path.join(buildRoot, "src");

    try {
        // 1. Clean and create build directory
        if (fs.existsSync(buildRoot)) {
            fs.rmSync(buildRoot, { recursive: true, force: true });
        }

        fs.mkdirSync(buildRoot, { recursive: true });
        fs.mkdirSync(srcDir, { recursive: true });

        // 2. Write base config files
        fs.writeFileSync(path.join(buildRoot, "package.json"), JSON.stringify({
            "name": "build",
            "private": true,
            "scripts": {
                "build": "vite build",
                "preview": "vite preview --host"
            },
            "dependencies": {
                "react": "^18.2.0",
                "react-dom": "^18.2.0"
            },
            "devDependencies": {
                "vite": "^5.0.0",
                "@vitejs/plugin-react": "^4.0.0",
                "@types/react": "^18.2.0",
                "@types/react-dom": "^18.2.0"
            }
        }));

        fs.writeFileSync(path.join(buildRoot, "vite.config.ts"), `
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
        `);

        fs.writeFileSync(path.join(buildRoot, "index.html"), `
<!doctype html>
<html>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
        `);

        fs.writeFileSync(path.join(srcDir, "main.tsx"), `
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
        `);

        // 3. Write user files
        for (const file of files) {
            const fullPath = path.join(buildRoot, file.path);
            const dir = path.dirname(fullPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(fullPath, file.content);
        }

        // 4. Install dependencies and build
        console.log("Installing dependencies...");
        execSync("npm install", {
            cwd: buildRoot,
            stdio: "inherit",
        });

        console.log("Building project...");
        execSync("npm run build", {
            cwd: buildRoot,
            stdio: "inherit",
        });

        const distPath = path.join(buildRoot, "dist");
        console.log("distPath", distPath);

        await uploadDirectoryToS3(distPath, projectId);
        const url = `https://${process.env.CLOUDFRONT_DOMAIN}/projects/${projectId}/`;
        return res.json({ url });
    } catch (error) {
        console.error("Error publishing project:", error);
        return res.status(500).json({ error: "Failed to publish project" });
    }
})

export default router;





