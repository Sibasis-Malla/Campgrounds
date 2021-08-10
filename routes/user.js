const express = require('express')
const router = express.Router()
const User = require('../models/user')
const catchAsync = require('../utils/catchAsync')
const passport = require('passport')
const user = require('../controllers/userController')


router.get('/register',user.getSignup)

router.post('/register',catchAsync(user.createUser))

router.get('/login',user.getLogin)
router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),user.allowLogin)
router.get('/logout',user.logout)

module.exports = router