import { ValidationError, UniqueConstraintError } from "sequelize";

// ENV variables setup
import dotenv from "dotenv";
dotenv.config();

// TypeScript types
import type { Request, Response } from "express";

// Middleware
export default function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
) {
  if (err instanceof Error) {
    if (err instanceof UniqueConstraintError) {
      return res.status(400).json({ error: "CPU must be unique" });
    }

    if (err instanceof ValidationError) {
      return res
        .status(400)
        .json({ error: err.errors.map((error) => error.message) });
    }

    return res.status(500).json({ error: String(err) });
  } else {
    return res.status(500).json({ error: "internal server error" });
  }
}
