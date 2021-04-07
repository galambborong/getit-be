const express = require('express');
const cors = require('cors');
const apiRouter = require('./routes/apiRouter');
const {
  customErrorHandler,
  err400,
  err404,
  err500
} = require('./errors/index');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api', apiRouter);

app.use(customErrorHandler);
app.use(err400);
app.use(err404);
app.use(err500);

module.exports = app;
