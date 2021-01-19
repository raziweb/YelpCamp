const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');

//**** CAMPGROUND ROUTES ****//

//GETs All Campgrounds
router.get('/', catchAsync(async (req, res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
}))

// GETs Form to add new Campground 
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

//POSTs new Campground
router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a campground');
    res.redirect(`/campgrounds/${campground._id}`);
}))

//to get a specific Campground
router.get('/:id', catchAsync(async (req, res)=>{
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews').populate('author');
    if (!campground) {
        req.flash('error', 'Cannot find this campground');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground });
}))

//To get the edit form to edit a specific Campground
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res)=>{
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find this campground');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground });
}))

//To update the edited campground and showing it
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res)=>{
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground);
    req.flash('success', 'Successfully updated the campground');
    res.redirect(`/campgrounds/${campground._id}`);
}))

//to delete a campground
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res)=>{
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the campground');
    res.redirect(`/campgrounds`);
}))

module.exports = router;