import express from "express";
import cors from "cors";

// Middleware
import errorHandler from "./middleware/errorHandler.js";

// Routes
import cpusRouter from "./controllers/cpus.js";
import healthRouter from "./controllers/health.js";
import testsRouter from "./controllers/tests.js";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

// Serve the static build for the frontend
if (process.env.NODE_ENV === "production") {
  app.use(express.static("dist"));
}

// Routes
app.use("/api/cpus", cpusRouter);
app.use("/api/health", healthRouter);

// Route to reset the test database data
if (process.env.NODE_ENV === "test") {
  app.use("/api/reset", testsRouter);
}

// Error handler middleware
app.use(errorHandler);

export default app;
