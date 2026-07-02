import express from "express";

// TypeScript types
import type { Request, Response, NextFunction } from "express";

const cpusRouter = express.Router();

// GET all data
cpusRouter.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await pool.query('SELECT * FROM cpus ORDER BY id');
    return res.json(data.rows);
  } catch (err: unknown) {
    next(err);
  }
});

// GET a single item
cpusRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await pool.query('SELECT * FROM cpus WHERE id = $1', [req.params.id]);
     if (result.rows.length === 0) return res.status(404).send('CPU was not found');
     res.json(result.rows[0]);
  } catch (err: unknown) {
    next(err);
  }
});

// POST a new item
cpusRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
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
      mbsocket
    } = req.body;

    if (
      !manufacturer ||
      !model ||
      cores < 1 ||
      threads < 1 ||
      cache < 0.01 ||
      baseclock < 0.01 ||
      boostclock < 0.01 ||
      !architecture ||
      !mbsocket
    ) {
      return res.status(400).send('Invalid input data');
    }

    const result = await pool.query(
      `INSERT INTO cpus (
        manufacturer, 
        model, 
        cores, 
        threads, 
        cache, 
        baseclock, 
        boostclock, 
        architecture, 
        mbsocket
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [manufacturer, model, cores, threads, cache, baseclock, boostclock, architecture, mbsocket]
    );

    res.status(201).send(result.rows[0]);
  } catch (err: unknown) {
    next(err);
  }
});

// PUT (updates) an item
cpusRouter.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
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
      mbsocket
    } = req.body;

    if (
      !manufacturer ||
      !model ||
      cores < 1 ||
      threads < 1 ||
      cache < 0.01 ||
      baseclock < 0.01 ||
      boostclock < 0.01 ||
      !architecture ||
      !mbsocket
    ) {
      return res.status(400).send('Invalid input data');
    }

    const result = await pool.query(
      `UPDATE cpus SET 
        manufacturer=$1, 
        model=$2, 
        cores=$3, 
        threads=$4, 
        cache=$5, 
        baseclock=$6, 
        boostclock=$7, 
        architecture=$8, 
        mbsocket=$9
      WHERE id=$10`,
      [manufacturer, model, cores, threads, cache, baseclock, boostclock, architecture, mbsocket, req.params.id]
    );

    // Checks if the item with the id exists
    if (result.rowCount === 0) {
      return res.status(404).send('CPU not found');
    }

    res.status(200).send('CPU has been updated!');
  } catch (err: unknown) {
    next(err);
  }
});

// DELETE an item
cpusRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await pool.query('DELETE FROM cpus WHERE id = $1', [req.params.id]);
     if (result.rowCount === 0) return res.status(404).send('CPU was not found');
     res.status(200).send('CPU was removed');
  } catch (err: unknown) {
    next(err);
  }
});

export default cpusRouter;
