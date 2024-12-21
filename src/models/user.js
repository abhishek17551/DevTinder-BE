const mongoose = require("mongoose")
const validator = require("validator");

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
        validate(value) {
            if (!validator.isEmail(value)) {
              throw new Error("Invalid email address: " + value);
            }
          }
    },
    password : {
        type : String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
              throw new Error("Enter a Strong Password: " + value);
            }
          }
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
        validate(value) {
            if (!validator.isURL(value)) {
              throw new Error("Invalid Photo URL: " + value);
            }
          },
    },
    about: {
        type: String,
        default: "This is a default 'About' of the user!",
    },
    skills: {
        type: [String],
    },
}, {
    timestamps : true
})

const User = mongoose.model('User',userSchema)

module.exports = User