module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl; //adding the original Url to the session, from where we were redirected to the login page
        req.flash('error', 'You must be signed in first')
        res.redirect('/login');
    } else {
        next();
    }
}