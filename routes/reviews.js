const express = require('express')
const router = express.Router({mergeParams: true})
const catchAsync = require('../utils/catchAsync')
const expressError = require('../utils/ExpressError')
const {reviewSchema} =require('../validationSchema') 
const Review = require('../models/reviews')
const CampGround = require('../models/campground')
const review = require('../controllers/reviewController')
const {validateReview,isAuthor,isLoggedin,isReviewAuthor} = require('../middleware')


router.post('/',isLoggedin,validateReview,catchAsync(review.createReview));
router.delete('/:reviewId',isReviewAuthor,isLoggedin,catchAsync(review.deleteReview))
module.exports = router