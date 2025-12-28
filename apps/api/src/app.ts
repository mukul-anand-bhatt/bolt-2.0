import express from "express";
import cors from 'cors';
import morgan from 'morgan';
import indexRoutes from "./routes/index.routes";

export function createApp() {
    const app = express();


    app.use(
        cors({
            origin: "*",
        })
    );
    // app.use(express.urlencoded({ extended: true }));
    app.use(express.json());


    app.use(morgan("dev"));

    app.use("/api/v1", indexRoutes)

    app.get("/health", (req, res) => {
        res.json({ status: "ok" });
    });

    return app;
}