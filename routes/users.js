const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');

router.get('/register', (req, res) => {
    res.render('users/register');
})

router.post('/register',catchAsync(async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => { //logging in the user after registering
            if (err) return next(err);
            else {
                req.flash('success', 'Welcome to YelpCamp');
                res.redirect('/campgrounds');
            }
        })
    } catch (error) {
        req.flash('error', error.message);
        res.redirect('/register');
    }
}))

router.get('/login', (req, res) => {
    res.render('users/login')
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    //Everything related to authentication happens in the passport.authenticate() middleware
    //Like looking up the username in the DB and matching the password etc
    req.flash('success', 'Welcome back');
    res.redirect('/campgrounds')
})

router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success', 'Successfully logged you out');
    res.redirect('/campgrounds')
})

module.exports = router;