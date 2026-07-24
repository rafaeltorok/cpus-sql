import express from "express";

// Models
import Cpu from "../models/cpu.js";

// Middleware
import validateId from "../middleware/validators/validateId.js";
import validateCpu from "../middleware/validators/cpuValidator.js";

// TypeScript types
import type { Request, Response, NextFunction } from "express";
import type { NewCpu } from "../../types/types.js";

const cpusRouter = express.Router();

// GET all data
cpusRouter.get(
  "/",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await Cpu.findAll({
        order: ["id"],
      });
      return res.status(200).json(data);
    } catch (err: unknown) {
      next(err);
    }
  },
);

// GET a single item
cpusRouter.get(
  "/:id",
  validateId,
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const cpu = await Cpu.findByPk(req.params.id);

      if (!cpu) {
        return res.status(404).end();
      }

      return res.status(200).json(cpu);
    } catch (err: unknown) {
      next(err);
    }
  },
);

// POST a new item
cpusRouter.post(
  "/",
  validateCpu,
  async (
    req: Request<unknown, unknown, NewCpu>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const {
        manufacturer,
        model,
        cores,
        threads,
        cache,
        baseclock,
        boostclock,
        architecture,
        mbsocket,
      } = req.body;

      // Handles the optional TDP value
      let tdp;

      if (!req.body.tdp) {
        tdp = 0;
      } else {
        tdp = req.body.tdp;
      }

      // Create a new CPU object
      const newCpu = await Cpu.create({
        manufacturer,
        model,
        cores,
        threads,
        cache,
        baseclock,
        boostclock,
        architecture,
        mbsocket,
        tdp,
      });

      return res.status(201).json(newCpu);
    } catch (err: unknown) {
      next(err);
    }
  },
);

// PUT (updates) an item
cpusRouter.put(
  "/:id",
  validateId,
  validateCpu,
  async (
    req: Request<{ id: string }, unknown, NewCpu>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const {
        manufacturer,
        model,
        cores,
        threads,
        cache,
        baseclock,
        boostclock,
        architecture,
        mbsocket,
        tdp,
      } = req.body;

      // Get the CPU to be updated from the database
      const cpuToUpdate = await Cpu.findByPk(req.params.id);

      if (!cpuToUpdate) {
        return res.status(404).end();
      }

      // Update the object with the new data
      await cpuToUpdate.update({
        manufacturer,
        model,
        cores,
        threads,
        cache,
        baseclock,
        boostclock,
        architecture,
        mbsocket,
        tdp,
      });

      return res.status(200).json(cpuToUpdate);
    } catch (err: unknown) {
      next(err);
    }
  },
);

// DELETE an item
cpusRouter.delete(
  "/:id",
  validateId,
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      // Remove the CPU
      const removedObjects = await Cpu.destroy({
        where: {
          id: req.params.id,
        },
      });

      if (removedObjects === 1) {
        return res.status(204).end();
      } else {
        return res.status(404).end();
      }
    } catch (err: unknown) {
      next(err);
    }
  },
);

export default cpusRouter;
