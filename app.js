const express = require('express');
const apiRouter = require('./routes/apiRouter');
const {
  err500,
  customErrorHandler,
  err405,
  err400
} = require('./errors/index');
const app = express();

app.use(express.json());

app.use('/api', apiRouter);
app.use(customErrorHandler);

app.use(err400);
app.use(err405);
app.use(err500);

module.exports = app;
