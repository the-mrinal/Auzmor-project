const express = require('express');
const app = express();
const inbound = require('./api/routes/inbound');
const outbound = require('./api/routes/outbound');

app.use('/inbound',inbound);
app.use('/outbound',outbound);

module.exports = app;