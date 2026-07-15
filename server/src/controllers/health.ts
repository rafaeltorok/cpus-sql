import express from "express";

// TypeScript types
import type { Request, Response, NextFunction } from "express";

const healthRouter = express.Router();

healthRouter.get("/", (_req: Request, res: Response, _next: NextFunction) => {
  return res.status(200).send("Server is online");
});

export default healthRouter;
