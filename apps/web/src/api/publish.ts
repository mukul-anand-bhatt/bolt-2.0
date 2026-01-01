
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api/v1"

export async function publish(projectId: string) {
    const res = await fetch(`${API_URL}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
    });

    const data = await res.json();
    window.open(data.url, "_blank");
}
