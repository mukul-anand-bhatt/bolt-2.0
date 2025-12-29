import express from "express";
import projectRoutes from "./projects.routes"
import fileRoutes from "./files.routs"
const app = express();

app.use("/projects", projectRoutes)
app.use("/files", fileRoutes)


export default app;