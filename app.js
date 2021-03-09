const express = require('express');
const apiRouter = require('./routes/apiRouter')
const app = express();

app.use('/api', apiRouter);

module.exports = app;