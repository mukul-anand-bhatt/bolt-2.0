import express from "express";
import projectRoutes from "./projects.routes"
import fileRoutes from "./files.routs"
import publishRoutes from "./publish.routes"
const app = express();

app.use("/projects", projectRoutes)
app.use("/files", fileRoutes)
app.use("/publish", publishRoutes)


export default app;