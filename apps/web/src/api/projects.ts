import type { Project } from "@boltyy/shared/src/index";

const API_URL = "http://localhost:5001/api/v1";

export async function getProjects(): Promise<Project[]> {
    const response = await fetch(`${API_URL}/projects`);
    return response.json();
}

export async function createProject(name: string): Promise<Project> {
    const response = await fetch(`${API_URL}/projects`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name })
    });
    return response.json();
}
