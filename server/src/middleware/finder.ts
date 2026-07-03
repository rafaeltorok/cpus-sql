// Models
import Cpu from "../models/cpu.js";

// TypeScript types
import type { Request, Response, NextFunction } from "express";

// Handles finding a CPU based on its id
export default async function cpuFinder(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  req.cpu = await Cpu.findByPk(req.params.id);

  if (!req.cpu) {
    return res.status(404).end();
  }
  next();
}
