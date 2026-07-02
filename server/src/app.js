const express = require('express');
const cors = require('cors');
const pgRouter = require('./routes/routes');
require('dotenv').config();
const app = express();

const port = process.env.PORT;

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use('/api', pgRouter);

app.listen(port, () => console.log(`Server running on port: ${port}`));