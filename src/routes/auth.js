const express = require('express');
const authRouter = express.Router()
const bcrypt = require("bcrypt");

const User = require('../models/user');

const { validateSignupData } = require('../utils/validation');


authRouter.post("/signup", async (req, res) => {
    try {
        //Validate data
        validateSignupData(req)
        
        const {firstName,lastName,emailId,password} = req.body
    
        //Encrypt the password
        const passwordHash = await bcrypt.hash(password,12)
    
        //Creating a new instance of User model
        const user = new User({
            firstName,lastName,emailId,password:passwordHash
        })
            await user.save()
            res.status(201).send("User added successfully");
        }
        catch(err){
            res.status(400).send('Error in adding User:'+err.message)
        }
  });
  
authRouter.post("/login", async (req, res) => {
    try {
        const {emailId,password} = req.body

        //Check if email exists
        const signedInUser = await User.findOne({emailId : emailId})

        if(!signedInUser){
            throw new Error('Please Sign Up!')
        }

        const isPasswordValid = await signedInUser.validatePassword(password)

        if(isPasswordValid) {
            //After successful login, encode jwt token & set cookie 
            const token = await signedInUser.createJWT()

            res.cookie("token",token,{expires : new Date(Date.now() + 8*3600000)})

            res.send('Login Successful!')
        } else {
            throw new Error('Invalid Credentials!')
        }
    }
    catch(err){
        res.status(400).send('ERROR : '+ err.message)
    }
})

authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
    });
    res.send("Logout Successful!!");
  });

module.exports = authRouter