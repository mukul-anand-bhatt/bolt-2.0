import { useEffect, useState } from "react";
import { createProject, getProjects } from "./api/projects";
import { saveProjectFiles, loadProjectFiles } from "./api/files";
import type { Project, ProjectFiles, projectFile } from "@boltyy/shared";
import { PreviewPane } from "./components/previewPane";
import { buildProject } from "./build/buildProject";



function FileEditor({ projectId, onFileSaved, onPublish }: { projectId: string; onFileSaved: () => void; onPublish: () => void }) {
  const [content, setContent] = useState("");

  useEffect(() => {
    loadProjectFiles(projectId).then((files) => {
      const appFile = files.find(
        (f: projectFile) => f.path === "src/App.tsx"
      );
      if (appFile) setContent(appFile.content);
    });
  }, [projectId]);

  async function save() {
    const files: ProjectFiles = [
      {
        path: "src/App.tsx",
        content,
      },
    ];
    await saveProjectFiles(projectId, files);
    onFileSaved();
    alert("Files saved");
  }



  return (
    <div className="mt-6">
      <h2 className="font-semibold mb-2">src/App.tsx</h2>

      <textarea
        className="w-full h-64 border rounded p-2 font-mono text-sm"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button
        onClick={save}
        className="mt-2 px-4 py-1 border rounded"
      >
        Save Files
      </button>

      <button
        onClick={onPublish}
        className="mt-2 "
      >
        Publish(Local)
      </button>
    </div>
  );
}


function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [activeFiles, setActiveFiles] = useState<ProjectFiles>([]);

  async function loadProjects() {
    const data = await getProjects();
    setProjects(data);
  }

  async function onCreate() {
    if (!name) return;
    await createProject(name);
    setName("");
    loadProjects();
  }

  useEffect(() => {
    if (!activeProjectId) return;
    loadProjectFiles(activeProjectId).then(setActiveFiles);
  }, [activeProjectId]);

  return (
    <div className="p-10 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Boltyy</h1>

      {/* Create Project */}
      <div className="flex gap-2 mb-6">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Project name"
          className="border rounded px-2 py-1 flex-1"
        />
        <button
          onClick={onCreate}
          className="border rounded px-4"
        >
          Create
        </button>
      </div>

      {/* Project List */}
      <ul className="space-y-1">
        {projects.map((p) => (
          <li
            key={p.id}
            className={`cursor-pointer underline ${activeProjectId === p.id ? "font-semibold" : ""
              }`}
            onClick={() => setActiveProjectId(p.id)}
          >
            {p.name}
          </li>
        ))}
      </ul>

      {/* File Editor */}
      {activeProjectId && (
        <FileEditor
          projectId={activeProjectId}
          onFileSaved={() => loadProjectFiles(activeProjectId).then(setActiveFiles)}
          onPublish={async () => {
            if (!activeFiles.length) return;
            const { url } = await buildProject(activeFiles);
            window.open(url, "_blank");
          }}
        />
      )}

      {/* Preview */}
      {activeFiles.length > 0 && (
        <PreviewPane files={activeFiles} />
      )}
    </div>
  );
}

export default App;
