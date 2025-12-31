import { ProjectFiles } from "@boltyy/shared/src";

const projectFiles = new Map<string, ProjectFiles>();


export function saveFiles(projectId: string, files: ProjectFiles) {
    projectFiles.set(projectId, files);
}

export function getFiles(projectId: string): ProjectFiles {
    return projectFiles.get(projectId) || [];
}