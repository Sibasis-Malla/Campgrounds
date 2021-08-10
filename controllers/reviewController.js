const CampGround = require('../models/campground');
const Review = require('../models/reviews');

module.exports.createReview = async(req,res)=>{
    const {id} = req.params
    const campground = await CampGround.findById(id)
    //console.log(campground)
    const review = new Review(req.body.review)
    review.author= req.user._id
    console.log(campground)
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success', 'Successfully added review!')
    res.redirect(`/campgrounds/${id}`)


}
module.exports.deleteReview = async(req,res,next)=>{
    await CampGround.findByIdAndUpdate(req.params.id,{$pull:{reviews:req.params.reviewId}})
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', 'Successfully deleted review!')
    res.redirect(`/campgrounds/${req.params.id}`)
    

}