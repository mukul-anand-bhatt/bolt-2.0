import { useEffect, useRef, useState } from "react";
import { getWebContainer } from "../webContainer";
import { filesToFs } from "../utils/filesToFs";
import type { projectFiles } from "@boltyy/shared";

export function PreviewPane({ files }: { files: projectFiles }) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function start() {
            setLoading(true);

            const container = await getWebContainer();

            const filesWithEntry = [...files];
            if (!filesWithEntry.find(f => f.path === "src/main.tsx")) {
                filesWithEntry.push({
                    path: "src/main.tsx",
                    content: `
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
`
                });
            }

            await container.mount({
                "package.json": {
                    file: {
                        contents: JSON.stringify({
                            name: "preview",
                            private: true,
                            scripts: {
                                dev: "vite --host",
                            },
                            dependencies: {
                                react: "^18.2.0",
                                "react-dom": "^18.2.0",
                            },
                            devDependencies: {
                                vite: "^5.0.0",
                                "@vitejs/plugin-react": "^4.0.0",
                            },
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
                ...filesToFs(filesWithEntry),
            });

            const install = await container.spawn("npm", ["install"]);
            await install.exit;

            const dev = await container.spawn("npm", ["run", "dev"]);

            container.on("server-ready", (port, url) => {
                if (iframeRef.current) {
                    iframeRef.current.src = url;
                }
                setLoading(false);
            });
        }

        start();
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
