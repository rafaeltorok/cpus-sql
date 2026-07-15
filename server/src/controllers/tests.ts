import express from "express";
import Cpu from "../models/cpu.js";

// TypeScript types
import type { Request, Response, NextFunction } from "express";

const testsRouter = express.Router();

// Route
testsRouter.post(
  "/",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      await Cpu.truncate({ restartIdentity: true });
      return res.status(200).end();
    } catch (err: unknown) {
      if (err instanceof Error) {
        next(err);
      }
      next(String(err));
    }
  },
);

export default testsRouter;
