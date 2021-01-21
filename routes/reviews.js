const express = require('express');
const router = express.Router({mergeParams:true}); //mergeParams => to get access to campground id
const catchAsync = require('../utils/catchAsync');
const Review = require('../models/review');
const Campground = require('../models/campground');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const reviews = require('../controllers/reviews')

//*** REVIEW ROUTES ***//

//Creating a review
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

//deleting a review
router.delete('/:reviewId',isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;