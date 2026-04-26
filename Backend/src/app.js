import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRouter from "./routes/auth.routes.js";
import incidentRouter from "./routes/incident.routes.js";
import notificationRouter from "./routes/notification.routes.js";

const app = express();

// Security Middlewares
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(helmet());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Increased limit for development/testing
  message: "Too many requests from this IP, please try again after 15 minutes"
});
app.use("/api/", apiLimiter);

// Middlewares
app.use(express.json({ limit: "10kb" })); // Limit body size to prevent payload too large attacks
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
app.use(morgan("dev"));

// API routes first
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

app.use("/api/auth", authRouter);
app.use("/api/incidents", incidentRouter);
app.use("/api/notifications", notificationRouter);
export default app;
