// server/routes/reviews.js
const express = require('express');
const router = express.Router();
const Review = require('../models/review');

// LIST all reviews
router.get('/', async (req, res) => {
    try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.render('Reviews/list', {
        title: 'All Reviews',
        reviews
    });
    } catch (err) {
    console.error(err);
    res.status(500).render('Reviews/error', {
        title: 'Error',
        message: 'Error fetching reviews.'
    });
    }
});

// CREATE form
router.get('/add', (req, res) => {
    res.render('Reviews/add', {
    title: 'Add New Review',
    review: {}
    });
});

// CREATE submit
router.post('/add', async function(req, res, next) {
    try {
        let newReview = new Review({
            title: req.body.title,
            author: req.body.author,
            rating: req.body.rating,
            reviewText: req.body.reviewText,
            dateRead: req.body.dateRead || null
        });

        await Review.create(newReview);
        res.redirect('/reviews');
    } catch (err) {
        console.error(err);
        next(err);
    }
});


// DETAIL page
router.get('/:id', async (req, res) => {
    try {
    const review = await Review.findById(req.params.id);
    if (!review) {
        return res.status(404).render('Reviews/error', {
        title: 'Not Found',
        message: 'Review not found.'
        });
    }

    res.render('Reviews/edit', {
        title: `View / Edit: ${review.title}`,
        review,
        readonly: true
    });
    } catch (err) {
    console.error(err);
    res.status(500).render('Reviews/error', {
        title: 'Error',
        message: 'Error loading review details.'
    });
    }
});

// EDIT form
router.get('/:id/edit', async (req, res) => {
    try {
    const review = await Review.findById(req.params.id);
    if (!review) {
        return res.status(404).render('Reviews/error', {
        title: 'Not Found',
        message: 'Review not found.'
        });
    }

    res.render('Reviews/edit', {
        title: `Edit: ${review.title}`,
        review,
        readonly: false
    });
    } catch (err) {
    console.error(err);
    res.status(500).render('Reviews/error', {
        title: 'Error',
        message: 'Error loading edit form.'
    });
    }
});

// EDIT submit
router.post('/:id/edit', async function(req, res, next) {
    try {
        let updatedReview = {
            title: req.body.title,
            author: req.body.author,
            rating: req.body.rating,
            reviewText: req.body.reviewText,
            dateRead: req.body.dateRead || null
        };

        await Review.findByIdAndUpdate(req.params.id, updatedReview);

        res.redirect('/reviews');
    } catch (err) {
        console.error(err);
        next(err);
    }
});


// DELETE
// server/routes/reviews.js
router.post('/:id/delete', async (req, res, next) => {
    try {
    await Review.findByIdAndDelete(req.params.id);
    res.redirect('/reviews');
    } catch (err) {
    console.error(err);
    res.status(500).render('partials/error', {
        title: 'Error',
        message: 'Error deleting review.'
    });
    }
});

module.exports = router;