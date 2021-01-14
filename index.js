const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const ExpressError = require('./utils/ExpressError');
const mongoose = require("mongoose");
const methodOverride = require('method-override');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');

//Connecting to our yelp-camp mongoDb
mongoose.connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
.then(()=>console.log('Database Connected'))
.catch(err => console.log('Couldnt Connect', err))

const app = express();

app.use(express.urlencoded({ extended: true })); //to parse form data
app.use(methodOverride('_method')); //to use HTTP verbs other than GET and POST
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.engine('ejs', ejsMate); //ejs itself has different engines
app.set('views', path.join(__dirname, 'views'));

const sessionConfig = {
    secret: 'xyz123',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //session cookie will expire in a week
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));

//*** CAMPGROUND ROUTES***//
app.use('/campgrounds', campgroundRoutes)

//*** REVIEW ROUTES ***//
app.use('/campgrounds/:id/reviews', reviewRoutes);

//If no route matches
app.all('*', (req, res, next) => { //all includes all http verbs
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