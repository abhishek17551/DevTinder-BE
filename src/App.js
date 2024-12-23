const express = require('express')
const connectDB = require('./config/database')
const User = require('./models/user')
const bcrypt = require("bcrypt")
const { validateSignupData } = require('./utils/validation')
const cookieParser = require('cookie-parser')
const jwt  = require('jsonwebtoken')
const { userAuth } = require('./middlewares/auth')
const app = express()

//Applies to all requests to express server
//Converts JSON requests on server to JS readable objects  
app.use(express.json())
app.use(cookieParser())


app.post("/signup", async (req,res)=>{  

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
})  

app.post("/login", async (req,res) => {
    try {
        const {emailId,password} = req.body

        //Check if email exists
        const loggedInUser = await User.findOne({emailId : emailId})

        if(!loggedInUser){
            throw new Error('Invalid Credentials!')
        }

        const isPasswordValid = await bcrypt.compare(password,loggedInUser.password)
        if(isPasswordValid) {
            //After successful login, encode jwt token & set cookie 
            const token = await jwt.sign({_id:loggedInUser._id},"Abhi$hek@1029",{expiresIn : "5h"})
            res.cookie("token",token)

            res.send('Login Successful!')
        } else {
            throw new Error('Invalid Credentials!')
        }
    }
    catch(err){
        res.status(400).send('ERROR : '+ err.message)
    }
})

//Get User Profile
app.get("/profile",userAuth, async (req,res) => {
 try {
    const user = req.user 
    res.send(user)
 }
 catch(err){
    res.status(400).send('ERROR : '+ err.message)
}
})



//Update user by ID
app.patch('/user/:userId', async (req,res) => {
    const userId = req.params?.userId
    const data = req.body
    try {
        const ALLOWED_UPDATES = ['photoUrl','about','gender','age','skills']
        const isUpdateAllowed = Object.keys(data).every((item) => ALLOWED_UPDATES.includes(item))

        if(!isUpdateAllowed) {
            throw new Error('Update not allowed')
        }
        if(data.skills.length > 10) {
            throw new Error('Only 10 skills allowed')
        }
        const user = await User.findByIdAndUpdate({_id : userId}, data, {returnDocument:'after',runValidators:true})
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.send('Updated data successfully!!!')
    }
    catch(err){
        res.status(400).send('Something went wrong!!!')
    }
})






connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(7777, () => {
      console.log("Server is successfully listening on port 7777...");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!"+err.message);
  });

