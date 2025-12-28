import { useEffect, useState } from "react";
import { createProject, getProjects } from "./api/projects";
import type { Project } from "@boltyy/shared/src/index";

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");

  async function load() {
    const data = await getProjects();
    setProjects(data);
  }

  async function onCreate() {
    if (!name) return;
    await createProject(name);
    setName("");
    load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>Boltyy</h1>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Project name"
      />
      <button onClick={onCreate}>Create</button>

      <ul>
        {projects.map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
