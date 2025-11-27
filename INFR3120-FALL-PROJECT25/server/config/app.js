// server/config/app.js
require('dotenv').config();

const path = require('path');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const createError = require('http-errors');

const DB = require('./db');
const User = require('../models/user');

// MongoDB Connection 
mongoose.connect(DB.URI);
const mongoDB = mongoose.connection;

mongoDB.on('error', console.error.bind(console, 'Connection Error:'));
mongoDB.once('open', () => {
    console.log('Connected to the MongoDB');
});

// Express App Setup
const app = express();

app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '..', '..', 'public')));
app.use(express.static(path.join(__dirname, '..', '..', 'node_modules')));

app.use(
    session({
    secret: process.env.SESSION_SECRET || 'SomeSecret',
    resave: false,
    saveUninitialized: false,
    })
);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user || null;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// Routes 
const indexRouter = require('../routes/index');
const reviewsRouter = require('../routes/reviews');
const authRouter = require('../routes/auth');

app.use('/', indexRouter);
app.use('/reviews', reviewsRouter);
app.use('/auth', authRouter);

// 404
app.use(function (req, res, next) {
    next(createError(404));
});

app.use(function (err, req, res, next) {
  // set locals
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
    res.status(err.status || 500);
    res.render('error', { title: 'Error' });
});

module.exports = app;
