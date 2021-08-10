if(process.env.NODE_ENV!="production"){
    require('dotenv').config()
}
const express = require('express')
const router = express.Router()
const CampGround = require('../models/campground')
const catchAsync = require('../utils/catchAsync')
const campground = require('../controllers/campgroundController')
const multer = require('multer')
const {storage} = require('../Cloudinary/index')
const upload = multer({storage})


const {isLoggedin,isAuthor,validateCampground} = require('../middleware')




router.get('/',catchAsync(campground.index))

router.get('/new',isLoggedin,(campground.renderNewForm))
router.get('/:id/edit',isLoggedin,isAuthor,catchAsync(campground.renderEdit))
router.post('/',isLoggedin,upload.array('image'),validateCampground,catchAsync(campground.postNew))
// router.post('/',upload.array('image'),(req,res)=>{
//     console.log(req.body,req.files)
//     res.send("it worked")
// })


router.get('/:id',catchAsync(campground.getCamp))

router.put('/:id',isLoggedin,isAuthor,upload.array('image'),validateCampground ,catchAsync(campground.editCamp));



router.delete('/:id', isLoggedin,isAuthor,catchAsync(campground.delCamp))


module.exports = router