const express = require ('express');
const catchAsync = require('../utilities/catchAsync');

const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware.js')

const { newReview, deleteReview } = require('../controller/reviews');

const router = express.Router({ mergeParams: true });

router.post('/', isLoggedIn, validateReview, catchAsync(newReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(deleteReview));

module.exports = router;