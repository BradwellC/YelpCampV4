const express = require ('express');
const catchAsync = require('../utilities/catchAsync');

const { indexCampgrounds, createCampground, newCampground, showCampground, editCampground, updateCampground, deleteCampground } = require('../controller/campgrounds');

const { isLoggedIn, validateCampground, isAuthor } = require('../middleware.js');

const multer  = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const router = express.Router();

router.route('/')
    .get(catchAsync(indexCampgrounds))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(createCampground));


router.get('/new', isLoggedIn, newCampground);

router.route('/:id')
    .get(catchAsync(showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(updateCampground))
    .delete(isAuthor, catchAsync(deleteCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(editCampground));

module.exports = router;