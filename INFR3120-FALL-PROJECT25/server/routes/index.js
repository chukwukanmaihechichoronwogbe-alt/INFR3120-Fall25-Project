var express = require('express');
var router = express.Router();
const Review = require('../models/review');

/* GET home page. */
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).limit(10);
    res.render('index', { title: 'PageTurners - Book Review Hub', reviews });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading landing page');
  }
});

module.exports = router;
