const User = require('../models/user');

module.exports.registerUser = (req, res) => {
    res.render('auth/register');
}

module.exports.createUser = async(req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const newUser = await User.register(user, password);

        req.login(newUser, err => {
            if(err) return next(err);
            req.flash('success', 'Welcome to YelpCamp!');
            res.redirect('/campgrounds');
        })

        req.flash('success', 'Welcome to Yelpcamp!');
        res.redirect('/campgrounds');
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

module.exports.userLogin = (req, res) => {
    res.render('auth/login');
}

module.exports.loginUser = (req, res) => {
    req.flash('success', 'Login Successful! Welcome Back!');

    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;

    res.redirect(redirectUrl);
}

module.exports.logoutUser = (req, res) => {
    req.logout();
    req.flash('success', 'You have successfully been logged out! Goodbye!')
    res.redirect('/campgrounds');
}