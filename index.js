const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const Joi = require('joi');
const { campgroundSchema, reviewSchema } = require('./schemas');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const mongoose = require("mongoose");
const methodOverride = require('method-override');

//Connecting to our yelp-camp mongoDb
mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(()=>console.log('Database Connected'))
.catch(err => console.log('Couldnt Connect', err))

//requiring the campground model
const Campground = require('./models/campground');
const Review = require('./models/review');

const app = express();
//to parse form data
app.use(express.urlencoded({ extended: true }));
//to use HTTP verbs other than GET and POST
app.use(methodOverride('_method'));

//middleware function to validate campground
const validateCampground = (req, res, next) => {
    //extracting error
    const { error } = campgroundSchema.validate(req.body); //campgroundSchema from schemas.js
    if (error) {
        //extracting message from error
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body); //reviewSchema from schemas.js
    if (error) {
        //extracting message from error
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

app.set('view engine', 'ejs');
//ejs itself has different engines
app.engine('ejs', ejsMate); 
app.set('views', path.join(__dirname, 'views'));

//GETs All Campgrounds
app.get('/campgrounds', catchAsync(async (req, res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
}))

// GETs Form to add new Campground 
app.get('/campgrounds/new', (req,res)=>{
    res.render('campgrounds/new');
})

//POSTs new Campground
app.post('/campgrounds', validateCampground, catchAsync(async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

//to get a specific Campground
app.get('/campgrounds/:id', catchAsync(async (req, res)=>{
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    res.render('campgrounds/show', { campground });
}))

//To edit a specific Campground
app.get('/campgrounds/:id/edit', catchAsync(async (req, res)=>{
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', { campground });
}))

//To update the edited campground and showing it
app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res)=>{
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground);
    res.redirect(`/campgrounds/${campground._id}`);
}))

//to delete a campground
app.delete('/campgrounds/:id', catchAsync(async (req, res)=>{
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    res.redirect(`/campgrounds`);
}))

//*** REVIEW ROUTES ***//

//Creating a review
app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

//deleting a review
app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); //pull is a mongo operator used to delete matching items from the specified array
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);

}))

//If no route matches
//all includes all http verbs
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

//error handling middleware
app.use((err, req, res, next) => {
    const { message = 'Something went wrong', statusCode = 500 } = err;
    res.status(statusCode).render('error', {err});
})

app.listen(3000, ()=>{
    console.log('Server listening on port 3000');
})