const express = require('express');
const router = express.Router({mergeParams:true}); //mergeParams => to get access to campground id
const { reviewSchema } = require('../schemas');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Review = require('../models/review');
const Campground = require('../models/campground');

//middleware to validate review schema
const validateReview = (req, res, next) => {
    console.log(reviewSchema);
    const { error } = reviewSchema.validate(req.body); //reviewSchema from schemas.js
    if (error) {
        const msg = error.details.map(el => el.message).join(','); //extracting message from error
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

//*** REVIEW ROUTES ***//

//Creating a review
router.post('/', validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Successfully created a review');
    res.redirect(`/campgrounds/${campground._id}`);
}))

//deleting a review
router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); //pull is a mongo operator used to delete matching items from the specified array
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted a review');
    res.redirect(`/campgrounds/${id}`);

}))

module.exports = router;