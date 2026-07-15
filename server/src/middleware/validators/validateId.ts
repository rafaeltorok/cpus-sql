import { param, validationResult } from "express-validator";

// TypeScript types
import type { Request, Response, NextFunction } from "express";

const validateId = [
  param("id").notEmpty().withMessage("Missing ID value"),
  param("id").isInt({ min: 0 }).withMessage("Invalid ID format"),

  // Handles the error response
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages: string[] = errors
        .array()
        .map((error) => String(error.msg));
      return res.status(400).json({ error: errorMessages });
    }
    next();
  },
];

export default validateId;
