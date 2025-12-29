import { Router } from "express";
import { saveFiles, getFiles } from "../store/files.store";


const router = Router();

router.post("/:projectId", (req, res) => {
    const { projectId } = req.params;
    const { files } = req.body;

    if (!Array.isArray(files)) {
        return res.status(400).json({ msg: "invalid files" })
    }

    saveFiles(projectId, files);

    return res.status(200).json({ msg: "Files saved sucessfully" })
})

router.get("/:projectId", (req, res) => {
    const { projectId } = req.params;

    const files = getFiles(projectId);

    return res.status(200).json({ files, msg: "Files fetched sucessfully" })
})

export default router;