const express = require ('express');
const passport = require('passport');

const { createUser, registerUser, loginUser, logoutUser, userLogin } = require('../controller/auth');

const catchAsync = require('../utilities/catchAsync');

const router = express.Router();

router.route('/register')
    .get(registerUser)
    .post(catchAsync(createUser));

router.route('/login')
    .get(userLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),  loginUser);

router.get('/logout', logoutUser)

module.exports = router;