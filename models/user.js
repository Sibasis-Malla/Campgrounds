const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const passportLocalmoongoose = require('passport-local-mongoose')

const UserSchema = new Schema({
    email:{
        type: String,
        required: true,
    }
})

UserSchema.plugin(passportLocalmoongoose)

module.exports = mongoose.model("User",UserSchema)