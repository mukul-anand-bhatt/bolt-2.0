import { projectFiles } from "@boltyy/shared/src";

const projectFiles = new Map<string, projectFiles>();


export function saveFiles(projectId: string, files: projectFiles) {
    projectFiles.set(projectId, files);
}

export function getFiles(projectId: string): projectFiles {
    return projectFiles.get(projectId) || [];
}