import express from "express";
import cors from "cors";

// Middleware
import errorHandler from "./middleware/errorHandler.js";

// Routes
import cpusRouter from "./controllers/cpus.js";
import healthRouter from "./controllers/health.js";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);
app.use("/api/cpus", cpusRouter);
app.use("/api/health", healthRouter);

app.use(errorHandler);

export default app;
