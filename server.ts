import express from "express";
import cors from "cors";
import http from "http";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { initSocket } from "./socket";

import mainRouter from "./src/routes/index";

dotenv.config();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(cookieParser());

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

const server = http.createServer(app);

initSocket(server);
import "./src/jobs/roomBookingJobs";

app.use("/api", mainRouter);

server.listen(process.env.PORT, () => {
  console.log("Server running on port", process.env.PORT);
});
