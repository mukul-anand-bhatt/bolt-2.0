import type { ProjectFiles } from "@boltyy/shared";
import { getWebContainer } from "../webContainer";


export async function buildProject(
    files: ProjectFiles
): Promise<{ url: string }> {
    const container = await getWebContainer()

    await container.mount({
        "package.json": {
            file: {
                contents: JSON.stringify({
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
                })
            }
        },
        "vite.config.ts": {
            file: {
                contents: `
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
`,
            },
        },
        "index.html": {
            file: {
                contents: `
<!doctype html>
<html>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`,
            },
        },
    })

    await container.fs.mkdir("src", { recursive: true });

    for (const file of files) {
        await container.fs.writeFile(file.path, file.content);
    }

    await container.fs.writeFile(
        "src/main.tsx",
        `
            import React from 'react'
            import ReactDOM from 'react-dom/client'
            import App from './App'

            ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
        `
    )

    await container.fs.mkdir("build", { recursive: true });
    await container.fs.readdir("build");


    const install = await container.spawn("npm", ["install"]);
    await install.exit;

    const build = await container.spawn("npm", ["run", "dev"]);
    await build.exit;

    console.log("Build complete", build.output);


    // const preview = await container.spawn("npm", ["run", "preview"]);

    return new Promise((resolve) => {
        container.on("server-ready", (_, url) => {
            resolve({ url });
        });
    });
}




