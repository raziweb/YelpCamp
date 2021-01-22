const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const campgrounds = require('../controllers/campgrounds');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');
const multer = require('multer'); //for parsing form data which contains files
const { storage } = require('../cloudinary/index'); //our configured ready to use cloudinary storage space
const upload = multer({ storage }); //destination of upload

//**** CAMPGROUND ROUTES ****//

//GETs All Campgrounds
router.get('/', catchAsync(campgrounds.index))

// GETs Form to add new Campground 
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

//POSTs new Campground
router.post('/', isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))

//to get a specific Campground
router.get('/:id', catchAsync(campgrounds.showCampground))

//To get the edit form to edit a specific Campground
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

//To update the edited campground and showing it
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))

//to delete a campground
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

module.exports = router;