const express = require('express');
const path = require('path');
const routes = require('./routes/index');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static('public'));

app.use('/', routes);
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.render('error', {error: err});
})

module.exports = app;