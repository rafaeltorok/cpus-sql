import dotenv from "dotenv";
dotenv.config();

import type { Request, Response, NextFunction } from "express";

export default function errorHandler(err: unknown, _req: Request, res: Response, next: NextFunction) {
  if (err instanceof Error) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ error: "CPU must be unique" });
    }

    if (err.name === "SequelizeValidationError") {
      if (err.errors.length > 1) {
        return res
          .status(400)
          .json({ error: err.errors.map((error) => error.message) });
      } else {
        return res.status(400).json({ error: err.errors[0].message });
      }
    }
  } else {
    return res.status(500).json({ error: "internal server error" });
  }
}
