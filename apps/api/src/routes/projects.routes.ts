import { Router } from "express";
import { createProject, listProjects } from "../store/project.store";

const router = Router();

router.post("/", (req, res) => {
    const { name } = req.body;
    if (!name || typeof name !== "string") {
        return res.status(400).json({ msg: "Invalid Name" })
    }
    const Project = createProject(name);
    return res.status(200).json(Project);
})

router.get("/", (_, res) => {
    const projects = listProjects();
    return res.status(200).json(projects);
})

export default router;