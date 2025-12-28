import express from "express";
import projectRoutes from "./projects.routes"

const app = express();

app.use("/projects", projectRoutes)


export default app;