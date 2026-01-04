import { ProjectFiles } from "@boltyy/shared";
import path from "path";
import fs from "fs/promises";
import { exec } from "child_process";
import util from "util";

const execAsync = util.promisify(exec);

export async function buildProject(projectId: string, files: ProjectFiles) {
    const buildDir = path.resolve(process.cwd(), "tmp", projectId);

    // 1. Clean up old build dir if exists
    try {
        await fs.rm(buildDir, { recursive: true, force: true });
    } catch (e) {
        // ignore if doesn't exist
    }

    // 2. Create directory
    await fs.mkdir(buildDir, { recursive: true });

    // 3. Write Default Scaffolding (from apps/web/src/build/buildProject.ts)
    const storedFiles: Record<string, string> = {
        "package.json": JSON.stringify({
            name: "build",
            private: true,
            scripts: {
                build: "vite build",
                preview: "vite preview --host",
            },
            dependencies: {
                react: "^18.2.0",
                "react-dom": "^18.2.0",
            },
            devDependencies: {
                vite: "^5.0.0",
                "@vitejs/plugin-react": "^4.0.0",
                "@types/react": "^18.2.0",
                "@types/react-dom": "^18.2.0"
            }
        }),
        "vite.config.ts": `
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/projects/${projectId}",
  plugins: [react()],
});
`,
        "index.html": `
<!doctype html>
<html>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`,
        "src/main.tsx": `
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
`
    };

    // Write scaffolding files
    for (const [relativePath, content] of Object.entries(storedFiles)) {
        const filePath = path.join(buildDir, relativePath);
        const dir = path.dirname(filePath);
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(filePath, content);
    }

    // 4. Write User Files (Overwrites scaffolding if exists)
    for (const file of files) {
        // Secure path to prevent directory traversal
        const filePath = path.join(buildDir, file.path);

        // Ensure file path is actually within buildDir
        if (!filePath.startsWith(buildDir)) {
            console.warn(`Skipping potentially unsafe file path: ${file.path}`);
            continue;
        }

        const dir = path.dirname(filePath);
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(filePath, file.content);
    }

    // 5. Install & Build
    console.log(`Installing dependencies for project ${projectId}...`);
    // Note: In a real sandboxed env, we wouldn't trust user package.json blindly
    await execAsync("npm install", { cwd: buildDir });

    console.log(`Building project ${projectId}...`);
    await execAsync("npm run build", { cwd: buildDir });

    return buildDir;
}
