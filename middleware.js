const { campgroundSchema, reviewSchema } = require('./schemas');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl; //adding the original Url to the session, from where we were redirected to the login page
        req.flash('error', 'You must be signed in first')
        res.redirect('/login');
    } else {
        next();
    }
}

//middleware function to validate campground
module.exports.validateCampground = (req, res, next) => {
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

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author._id.equals(req.user._id)) {
        req.flash('error', "You don't have permission to do that");
        res.redirect(`/campgrounds/${id}`);
    } else {
        next();
    }
}

//middleware to validate review schema
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body); //reviewSchema from schemas.js
    if (error) {
        const msg = error.details.map(el => el.message).join(','); //extracting message from error
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}