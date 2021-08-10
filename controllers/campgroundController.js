const { required } = require('joi')

const CampGround = require('../models/campground')
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { cloudinary } = require('../Cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geoCoder = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });
// stylesService exposes listStyles(), createStyle(), getStyle(), etc.


module.exports.index = async (req,res)=>{
    const campgrounds = await CampGround.find({}).populate('popupText')
    res.render('campgrounds/index.ejs',{campgrounds})

}
module.exports.renderNewForm = (req,res)=>{
    res.render('campgrounds/new')
}

module.exports.renderEdit = async (req,res)=>{
    const {id}= req.params
    const campground = await CampGround.findById(id)  
    if(!campground){
        req.flash('error',"Can't find that campground")
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit',{campground})
    
}

module.exports.postNew = async(req,res,next)=>{
       const geoData =  await  geoCoder.forwardGeocode({
             query: req.body.location,
             limit: 1

         }).send()
        //  console.log(coordinates)
        //  res.send('Working')
         const campground = new CampGround(req.body)
         campground.geometry = geoData.body.features[0].geometry
         //req.locals.mapCoordinates = campground.geometry.coordinates
         campground.images = req.files.map(f=>({
             url: f.path,
             filename: f.filename
         }));
        //console.log(req.body)
         campground.author = req.user._id
        await campground.save()
        //console.log(campground)
        req.flash('success', 'Successfully added campground!');
        res.redirect(`campgrounds/${campground._id}`)

   
}

module.exports.getCamp = async(req,res)=>{
    const{id} = req.params
    const campground = await CampGround.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    //console.log(campground)
    const mapCoordinates = campground.geometry.coordinates
    //console.log(mapCoordinates)
   // console.log(campground.geometry.coordinates)
    
    if(!campground){
        req.flash('error',"Can't find that campground")
        res.redirect('/campgrounds')
    }
    else{
    //console.log(campground)
    res.render('campgrounds/show.ejs',{campground,mapCoordinates})
    }

}

module.exports.editCamp = async (req, res) => {
    const { id } = req.params;
    const geoData =  await  geoCoder.forwardGeocode({
        query: req.body.location,
        limit: 1

    }).send()
   //  console.log(coordinates)
   //  res.send('Working')
   
    

    const campground = await CampGround.findByIdAndUpdate(id, req.body)
    campground.geometry = geoData.body.features[0].geometry

    const imgs = req.files.map(f=>({
        url: f.path,
        filename: f.filename
    }));
    campground.images.push(...imgs)
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages ){
           await cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({$pull:{images:{filename:{$in: req.body.deleteImages}}}})
    }
    await campground.save()
    req.flash('success', 'Successfully updated campground!');
    //console.log(campground)
    res.redirect(`/campgrounds/${campground._id}`)
    

    
    
}

module.exports.delCamp = async(req,res)=>{
    const{id} = req.params
    const campground = await CampGround.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted campground!')
    res.redirect('/campgrounds')
    
}
