// server/routes/reviews.js
const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const Review = require('../models/review');

function requireAuth(req, res, next) {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
    req.flash('error', 'You must be logged in to perform that action.');
    return res.redirect('/auth/login');
    }
    next();
}

// ─── LIST all reviews ─────────────────────────────────────────
router.get('/', async (req, res, next) => {
    try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.render('Reviews/list', {
        title: 'All Reviews',
        reviews,
    });
    } catch (err) {
    console.error(err);
    next(err); // let global error handler render error.ejs
    }
});

router.get('/add', requireAuth, (req, res) => {
    res.render('Reviews/add', {
    title: 'Add Review',
    });
});

router.post('/add', requireAuth, async (req, res, next) => {
    try {
    const { title, author, rating, reviewText, dateRead } = req.body;

    await Review.create({
        title,
        author,
        rating,
        reviewText,
        dateRead: dateRead ? new Date(dateRead) : undefined,
    });

    req.flash('success', 'Review added successfully.');
    res.redirect('/reviews');
    } catch (err) {
    console.error(err);
    next(err);
    }
});


router.get('/:id/edit', requireAuth, async (req, res, next) => {
    try {
    const review = await Review.findById(req.params.id);

    if (!review) {
        return next(createError(404, 'Review not found'));
    }

    res.render('Reviews/edit', {
        title: 'Edit Review',
        review,
    });
    } catch (err) {
    console.error(err);
    next(err);
    }
});

router.post('/:id/edit', requireAuth, async (req, res, next) => {
    try {
    const { title, author, rating, reviewText, dateRead } = req.body;

    const review = await Review.findByIdAndUpdate(
        req.params.id,
        {
        title,
        author,
        rating,
        reviewText,
        dateRead: dateRead ? new Date(dateRead) : undefined,
        },
        { new: true, runValidators: true }
    );

    if (!review) {
        return next(createError(404, 'Review not found'));
    }

    req.flash('success', 'Review updated successfully.');
    res.redirect('/reviews');
    } catch (err) {
    console.error(err);
    next(err);
    }
});


router.post('/:id/delete', requireAuth, async (req, res, next) => {
    try {
    const deleted = await Review.findByIdAndDelete(req.params.id);

    if (!deleted) {
        return next(createError(404, 'Review not found'));
    }

    req.flash('success', 'Review deleted successfully.');
    res.redirect('/reviews');
    } catch (err) {
    console.error(err);
    next(err);
    }
});

module.exports = router;
