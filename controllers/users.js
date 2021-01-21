const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res) => {
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
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login')
}

//Everything related to authentication happens in the passport.authenticate() middleware
//Like looking up the username in the DB and matching the password etc
module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back');
    if (req.session.returnTo) { // in case we were redirected from some other page to login page
        const url = req.session.returnTo;
        delete req.session.returnTo; //deleting the returnTo path
        res.redirect(url); //going to the original page    
    } else {
        res.redirect('/campgrounds') 
    }
}

module.exports.logout = (req, res) => {
    req.logOut();
    req.flash('success', 'Successfully logged you out');
    res.redirect('/campgrounds')
}