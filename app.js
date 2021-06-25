if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}


const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const passportLocal = require('passport-local');

const User = require('./models/user');

const expressError = require('./utilities/expressError');

const campgroundRoutes = require('./routes/campgrounds');
const reviewsRoutes = require('./routes/reviews');
const authRoutes = require('./routes/auth');


const app = express();

// Database connection
mongoose.connect('mongodb+srv://Admin:N3wC4stl3@cluster0.ppq1v.mongodb.net/WDB?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
.then(result => {
    console.log('Connected to Database!')
})
.catch(err => {
    console.log(err);
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));


const sessionConfig = {
    secret: 'N7ghjYsdfiphstebfdkJHK',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res,next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use('/', authRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewsRoutes);

app.get('/', (req, res) => {
    res.render('landing');
});

app.all('*', (req, res, next) => {
    next(new expressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {

    const { statusCode = 500 } = err;

    if(!err.message) err.message = 'Oh no, Looks Something Went Wrong!'
    res.status(statusCode).render('error', { err });
});


app.listen(3000, () => {
    console.log('Server is live on 3000');
});