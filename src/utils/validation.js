const validator = require("validator");

const validateSignupData = (req) => {
    const {firstName,lastName,emailId,password} = req.body
    if(!firstName || !lastName) {
        throw new Error('Name is not valid!')
    } else if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid!"); 
    } else if(!validator.isStrongPassword(password)){
        throw new Error("Please enter a Strong Password!");
    }
}

const validateEditProfileData = (req) => {
    const editableFields = [    
        "firstName",
        "lastName",
        "emailId",
        "photoUrl",
        "gender",
        "age",
        "about",
        "skills",
    ]

    const isEditAllowed = Object.keys(req.body).every(field => editableFields.includes(field))
    return isEditAllowed
}

module.exports ={validateSignupData, validateEditProfileData}