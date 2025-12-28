
import { Project } from "@boltyy/shared/src/index";

const projects: Project[] = [];


export function createProject(name: string): Project {
    const project: Project = {
        id: crypto.randomUUID(),
        name,
        createdAt: new Date().toDateString(),
    }

    projects.push(project);

    return project;
}




export function listProjects(): Project[] {
    return projects;
}