const express = require('express');
const pool = require('../database/connection');
const pgRouter = express.Router();

// GET all data
pgRouter.get('/cpus', async (req, res) => {
  try {
    const data = await pool.query('SELECT * FROM cpus ORDER BY id');
    res.json(data.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET a single item
pgRouter.get('/cpus/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cpus WHERE id = $1', [req.params.id]);
     if (result.rows.length === 0) return res.status(404).send('CPU was not found');
     res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new item
pgRouter.post('/cpus', async (req, res) => {
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
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT (updates) an item
pgRouter.put('/cpus/:id', async (req, res) => {
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
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE an item
pgRouter.delete('/cpus/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM cpus WHERE id = $1', [req.params.id]);
     if (result.rowCount === 0) return res.status(404).send('CPU was not found');
     res.status(200).send('CPU was removed');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = pgRouter;