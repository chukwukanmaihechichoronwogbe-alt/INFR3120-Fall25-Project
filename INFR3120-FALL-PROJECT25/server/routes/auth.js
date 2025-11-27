// server/routes/auth.js
const express = require('express');
const passport = require('passport');
const User = require('../models/user');

const router = express.Router();

// GET /auth/register
router.get('/register', (req, res) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
    return res.redirect('/');
    }
    res.render('auth/register', {
    title: 'Register',
    errorMessage: null,
    });
});

// POST /auth/register
router.post('/register', (req, res) => {
    const { username, password, confirmPassword } = req.body;

  // basic validation
    if (!username || !password || !confirmPassword) {
    return res.render('auth/register', {
        title: 'Register',
        errorMessage: 'All fields are required.',
    });
    }

    if (password !== confirmPassword) {
    return res.render('auth/register', {
        title: 'Register',
        errorMessage: 'Passwords do not match.',
    });
    }

    const newUser = new User({ username });

    User.register(newUser, password, (err, user) => {
    if (err) {
        console.error(err);
        return res.render('auth/register', {
        title: 'Register',
        errorMessage: err.message || 'Registration failed.',
        });
    }

    // auto-login after successful registration
    req.login(user, (loginErr) => {
        if (loginErr) {
        console.error(loginErr);
        return res.render('auth/login', {
            title: 'Login',
            errorMessage: 'Registered, but auto-login failed. Please log in.',
        });
        }

        req.flash('success', 'Registration successful. You are now logged in.');
        return res.redirect('/');
    });
    });
});

// GET /auth/login
router.get('/login', (req, res) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
    return res.redirect('/');
    }
    res.render('auth/login', {
    title: 'Login',
    errorMessage: null,
    });
});

// POST /auth/login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
    if (err) {
        console.error(err);
        return res.render('auth/login', {
        title: 'Login',
        errorMessage: 'Login failed. Please try again.',
        });
    }
    if (!user) {
        return res.render('auth/login', {
        title: 'Login',
        errorMessage:
            (info && info.message) || 'Invalid username or password.',
        });
    }

    req.logIn(user, (loginErr) => {
        if (loginErr) {
        console.error(loginErr);
        return res.render('auth/login', {
            title: 'Login',
            errorMessage: 'Login failed. Please try again.',
        });
        }

        req.flash('success', 'Successfully logged in.');
        return res.redirect('/');
    });
    })(req, res, next);
});

// GET /auth/logout
router.get('/logout', (req, res) => {
    req.logout((err) => {
    if (err) {
        console.error(err);
        return res.redirect('/');
    }
    req.flash('success', 'You have been logged out.');
    res.redirect('/');
    });
});

module.exports = router;
