const express = require('express');
const router = express.Router();
const { campgroundSchema } = require('../schemas');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');

//middleware function to validate campground
const validateCampground = (req, res, next) => {
    //extracting error
    const { error } = campgroundSchema.validate(req.body); //campgroundSchema from schemas.js
    if (error) {
        const msg = error.details.map(el => el.message).join(',');//extracting message from error
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

//**** CAMPGROUND ROUTES ****//

//GETs All Campgrounds
router.get('/', catchAsync(async (req, res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
}))

// GETs Form to add new Campground 
router.get('/new', (req, res) => {
    res.render('campgrounds/new');
});

//POSTs new Campground
router.post('/', validateCampground, catchAsync(async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

//to get a specific Campground
router.get('/:id', catchAsync(async (req, res)=>{
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    res.render('campgrounds/show', { campground });
}))

//To edit a specific Campground
router.get('/:id/edit', catchAsync(async (req, res)=>{
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', { campground });
}))

//To update the edited campground and showing it
router.put('/:id', validateCampground, catchAsync(async (req, res)=>{
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground);
    res.redirect(`/campgrounds/${campground._id}`);
}))

//to delete a campground
router.delete('/:id', catchAsync(async (req, res)=>{
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    res.redirect(`/campgrounds`);
}))

module.exports = router;