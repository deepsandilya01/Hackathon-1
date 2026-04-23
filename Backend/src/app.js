import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// API routes first
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

export default app;
