const CampGround = require('./models/campground')
const expressError = require('./utils/ExpressError')

const Review = require('./models/reviews');

const {campgroundSchema,reviewSchema} =require('./validationSchema') 

module.exports.isLoggedin = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        //console.log(req.originalUrl)
        req.flash('error','You must be signed in !')
        return res.redirect('/login')
    }
    next()
}
module.exports.validateCampground = (req,res,next)=>{

    const {error} =  campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(',')
        throw new expressError(msg,400)
    }else{
        next()
    }
}
module.exports.isAuthor = async (req,res,next)=>{
    const{id}=req.params
    const campground = await CampGround.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error',"You don't have permission to do that ")
        return res.redirect(`/campgrounds/${id}`)
    }    
    next()

}

module.exports.validateReview = (req,res,next)=>{
    const {error} =  reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(',')
        throw new expressError(msg,400)
    }else{
        next()
    }

}
module.exports.isReviewAuthor = async (req,res,next)=>{
    const{reviewId,id}=req.params
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error',"You don't have permission to do that ")
        return res.redirect(`/campgrounds/${id}`)
    }    
    next()

}