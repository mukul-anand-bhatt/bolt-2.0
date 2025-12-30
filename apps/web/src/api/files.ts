import type { projectFiles } from "@boltyy/shared";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001"

export async function saveProjectFiles(projectId: string, files: projectFiles) {

    await fetch(`${API_URL}/files/${projectId}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ files }),
    })
}

export async function loadProjectFiles(projectId: string): Promise<projectFiles> {
    const res = await fetch(`${API_URL}/files/${projectId}`);
    const data = await res.json();
    return data.files;
}