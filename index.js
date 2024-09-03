const express = require("express");
require('express-async-errors');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const burgersRouter = require('./router/burgers.js');
const authRouter = require('./router/auth.js');
const { config } = require('./config.js');
const { sequelize } = require('./db/database.js');

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan('tiny'));

app.use('/api/burgers', burgersRouter);
app.use('/api/auth', authRouter);

app.use((req, res, next) => {
  res.sendStatus(404);
});

app.use((error, req, res, next) => {
  console.error(error);
  res.sendStatus(500);
});

sequelize.sync({alter: true}).then((client) => {
  console.log(client);
  const server = app.listen(config.host.port);
});