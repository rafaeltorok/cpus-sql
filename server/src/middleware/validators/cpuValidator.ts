import { body, validationResult } from "express-validator";

// TypeScript types
import type { Request, Response, NextFunction } from "express";

// Validations
const validateCpu = [
	// Manufacturer and Model validation
  body("manufacturer").notEmpty().withMessage("Manufacturer is required"),
  body("model").notEmpty().withMessage("Model is required"),
  
  // Cores validation
  body("cores").notEmpty().withMessage("Cores is required"),
  body("cores").custom((value) => {
      return typeof value === "number";
    })
    .withMessage("Invalid core amount"),
  body("cores").isInt({ min: 1 }).withMessage("Invalid amount of cores"),
    
  // Threads validation
  body("threads").notEmpty().withMessage("Threads is required"),
  body("threads").custom((value) => {
      return typeof value === "number";
    })
    .withMessage("Invalid thread amount"),
  body("threads").isInt({ min: 1 }).withMessage("Invalid amount of threads"),
    
  // Cache validation
  body("cache").notEmpty().withMessage("Cache is required"),
  body("cache").custom((value) => {
      return typeof value === "number";
    })
    .withMessage("Invalid cache format"),
  body("cache").isFloat({ min: 1 }).withMessage("Invalid cache amount"),
    
  // Base clock validation
  body("baseclock").notEmpty().withMessage("Base Clock is required"),
  body("baseclock").custom((value) => {
      return typeof value === "number";
    })
    .withMessage("Invalid core clock format"),
  body("baseclock").isFloat({ min: 1 }).withMessage("Invalid clock speed"),
  
  // Boost clock validation
  body("boostclock").notEmpty().withMessage("Boost Clock is required"),
  body("boostclock").custom((value) => {
      return typeof value === "number";
    })
    .withMessage("Invalid core clock format"),
  body("boostclock").isFloat({ min: 1 }).withMessage("Invalid clock speed"),
  
  // Architecture and Socket validation
  body("architecture").notEmpty().withMessage("Architecture is required"),
  body("mbsocket").notEmpty().withMessage("Motherboard socket is required"),

  // Handles the error response
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages: string[] = errors.array().map((error) => String(error.msg));
      return res.status(400).json({ error: errorMessages });
    }
    next();
  },
];

export default validateCpu;
