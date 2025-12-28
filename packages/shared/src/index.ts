export type Project = {
    id: string;
    name: string;
    createdAt: string;
};

export type DeploymentStatus =
    | "QUEUED"
    | "BUILDING"
    | "FAILED"
    | "DEPLOYED";

export type Deployment = {
    id: string;
    projectId: string;
    status: DeploymentStatus;
    url?: string;
};

export type CreateProjectInput = {
    name: string;
};




