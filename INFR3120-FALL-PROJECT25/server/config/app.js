require('dotenv').config();
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const DB = require('./db');

mongoose.connect(DB.URI);
let mongoDB = mongoose.connection;

mongoDB.on('error', console.error.bind(console, 'Connection Error:'));
mongoDB.once('open', () => {
    console.log('Connected to the MongoDB');
});
const indexRouter = require('../routes/index');
const reviewsRouter = require('../routes/reviews');

const app = express();


app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true })); // parse form data
app.use(express.static(path.join(__dirname, '..', '..', 'public')));

app.use('/', indexRouter);
app.use('/reviews', reviewsRouter);

app.use((req, res) => {
    res.status(404).render('Reviews/error', {
    title: 'Page Not Found',
    message: 'The page you requested could not be found.'
    });
});

module.exports = app;
