if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express =  require('express')
const Review = require('../models/reviews')
const app =  express()
const path = require('path')
const mongoose = require('mongoose')
const CampGround = require('../models/campground')
const cities = require('./cities')
const seedHelpers = require('./seedHelpers')
const{descriptors,places}=seedHelpers
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geoCoder = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN});
const dbUrl = process.env.DB_URL

mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Database connected!')
  
});
const seedDB = async()=>{
    await CampGround.deleteMany({})
    await Review.deleteMany({})
  
   
    for (let i =0;i<50;i++){
        
        const sample =(array)=> array[Math.floor((Math.random())*array.length)] ;
        const price = Math.floor(Math.random()*2000)+1000
        const locationRandom = `${cities[i].city},${cities[i].state}`
        const geoData =  await geoCoder.forwardGeocode({
            query: locationRandom,
            limit: 1

        }).send()
       //  consol
        const camp = new CampGround({
            author:'6112c9e8f23805001540457c',
            title : `${sample(descriptors)} ${sample(places)}`,
            price:20,
            location:locationRandom,
            geometry: {
                type: "Point",
                coordinates: geoData.body.features[0].geometry.coordinates
            },
            images:
            [
                {
                  
                  url: 'https://res.cloudinary.com/doybtqm8h/image/upload/v1628519503/YelpCamp/t7j7jmjy7whinu6nxbli.jpg',
                  filename: 'YelpCamp/t7j7jmjy7whinu6nxbli'
                },
                {
                  url: 'https://res.cloudinary.com/doybtqm8h/image/upload/v1628600780/YelpCamp/pars-sahin-V7uP-XzqX18-unsplash_igkdle.jpg',
                  filename: 'YelpCamp/pars-sahin-V7uP-XzqX18-unsplash_igkdle'

                },
                {
                  url: 'https://res.cloudinary.com/doybtqm8h/image/upload/v1628600783/YelpCamp/rahul-bhosale-yBgC-qVCxMg-unsplash_ymvu53.jpg',
                  filename:'YelpCamp/rahul-bhosale-yBgC-qVCxMg-unsplash_ymvu53'

                }

              ],
            
            description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati, tempore. Facilis, sapiente praesentium dignissimos minima magni suscipit odio explicabo quibusdam doloribus, eos molestiae, ipsum dolorem earum. Neque, tempora qui. Eius.",
            price: price
        })
        await camp.save()
    }
    
}
seedDB()