const express = require('express');
const path = require('path');
const routes = require('./routes/index');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', routes);

module.exports = app;
