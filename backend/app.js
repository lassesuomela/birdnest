const express = require('express')
require('dotenv').config()

const app = express()

const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

app.use(express.json());

app.use(cors());
app.use(morgan("dev"));
app.use(helmet());

const droneRoutes = require("./routes/droneRoutes");

app.use("/api", droneRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Internal server error, check console')
})

module.exports = app;