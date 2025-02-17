import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import http from "http";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import router from "./routes";
import fs from "fs";

dotenv.config();
const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Раздача статики (сначала static, потом dist)
app.use("/static", express.static(path.resolve(__dirname, "../static")));
app.use(express.static(path.resolve(__dirname, "./dist")));

// API маршруты
app.use("/api", router);

// Главная страница
app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, "./dist", "index.html"));
});

export default server;
