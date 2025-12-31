import { useEffect, useRef, useState } from "react";
import { getWebContainer } from "../webContainer";
import type { ProjectFiles } from "@boltyy/shared";
import { WebContainer } from "@webcontainer/api";

const BASE_FILES = {
    "package.json": {
        file: {
            contents: JSON.stringify({
                name: "preview",
                private: true,
                scripts: { dev: "vite --host" },
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
        },
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
};

export function PreviewPane({ files }: { files: ProjectFiles }) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [loading, setLoading] = useState(false);
    const containerRef = useRef<WebContainer | null>(null);
    const hasInjectedMainRef = useRef(false);
    const lastFilesRef = useRef<Record<string, string>>({});
    const devProcessRef = useRef<any>(null);

    useEffect(() => {
        async function run() {
            setLoading(true);

            // BOOTSTRAP (once)
            if (!containerRef.current) {
                const container = await getWebContainer();
                containerRef.current = container;

                await container.mount(BASE_FILES);

                const install = await container.spawn("npm", ["install"]);
                await install.exit;

                devProcessRef.current = await container.spawn("npm", ["run", "dev"]);

                container.on("server-ready", (_, url) => {
                    if (iframeRef.current) iframeRef.current.src = url;
                    setLoading(false);
                });
            }

            const container = containerRef.current!;

            // PATCH FILES (diffed)
            await container.fs.mkdir("src", { recursive: true });

            for (const file of files) {
                const prev = lastFilesRef.current[file.path];
                if (prev !== file.content) {
                    await container.fs.writeFile(file.path, file.content);
                    lastFilesRef.current[file.path] = file.content;
                }
            }

            // Ensure entry file (ONCE)
            if (!hasInjectedMainRef.current) {
                await container.fs.writeFile(
                    "src/main.tsx",
                    `
                        import React from 'react'
                        import ReactDOM from 'react-dom/client'
                        import App from './App'

                        ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
                    `
                );
                hasInjectedMainRef.current = true;
            }

            setLoading(false);
        }

        run();
    }, [files]);

    return (
        <div className="mt-6">
            <h2 className="font-semibold mb-2">Live Preview</h2>

            {loading && <p>Starting preview…</p>}

            <iframe
                ref={iframeRef}
                className="w-full h-96 border"
            />
        </div>
    );
}
