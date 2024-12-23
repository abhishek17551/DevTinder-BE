const jwt= require("jsonwebtoken")
const User = require("../models/user")


const userAuth = async (req,res,next) => {

    try {
        //Receive token
        const {token} = req.cookies
        if(!token) {
            throw new Error ("Token is not valid")
        }
        //Decode token
        const decodedObj = await jwt.verify(token,"Abhi$hek@1029")
        const {_id} = decodedObj
        //Get user details based on token
        const user = await User.findById(_id)
    
        if(!user) {
            throw new Error("User not found")
        }
        //Send user details
        req.user = user
        next();
       
    }
    catch(err) {
        res.status(400).send("ERROR : "+ err.message)
    }

}


module.exports = {userAuth}