const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required: true,
        minLength: 4,
        maxLength: 50,
    },
    lastName : {
        type : String
    },
    emailId : {
        type : String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true,
    },
    password : {
        type : String,
        required: true,
    },
    gender : {
        type : String,
        enum: {
            values: ["male", "female", "other"],
            message: `{VALUE} is not a valid gender type`,
          },
    },
    age : {
        type : Number,
        min: 18,
    },
    photoUrl : {
        type: String,
        default: "https://geographyandyou.com/images/user-profile.png",
    },
    about: {
        type: String,
        default: "This is a default about of the user!",
    },
    skills: {
        type: [String],
    },
}, {
    timestamps : true
})

const User = mongoose.model('User',userSchema)

module.exports = User