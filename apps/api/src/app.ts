import express from "express";
import cors from 'cors';
import morgan from 'morgan';

export function createApp() {
    const app = express();

    app.use(
        cors({
            origin: "*",
        })
    );

    app.use(morgan("dev"));

    app.get("/health", (req, res) => {
        res.json({ status: "ok" });
    });

    return app;
}