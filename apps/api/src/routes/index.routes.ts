import express from "express";
import projectRoutes from "./projects.routes"
import fileRoutes from "./files.routs"
import publishRoutes from "./publish.routes"
import generateRoutes from "./generate.routes"
import workspaceRoutes from "./workspace.routes"
import userRoutes from "./user.routes"
import messageRoutes from "./message.routes"
import chatRoutes from "./chat.routes"
import aiCodeRoutes from "./ai-code.routes"

const app = express();

app.use("/projects", projectRoutes)
app.use("/files", fileRoutes)
app.use("/publish", publishRoutes)
app.use("/generate", generateRoutes)
app.use("/user", userRoutes)
app.use("/workspace", workspaceRoutes)
app.use("/messages", messageRoutes)
app.use("/chat", chatRoutes)
app.use("/gen-code", aiCodeRoutes)

export default app;