const express = require('express')
const connectDB = require('./config/database')
const User = require('./models/user')
const bcrypt = require("bcrypt")
const { validateSignupData } = require('./utils/validation')
const app = express()

//Applies to all requests to express server
//Converts JSON requests on server to JS readable objects  
app.use(express.json())


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

//Get user by emailId
app.get('/user', async (req,res) => {
    const userEmail = req.body.emailId

    try {
        const user = await User.findOne({emailId:userEmail})
        if(!user){
            res.status(404).send("User not found")
        } else {
            res.send(user)
        }
    }
    catch(err){
        res.status(400).send('Something went wrong!!!')
    }
})

//Delete user by ID
app.delete('/user', async (req,res) => {
    const userId = req.body.userId
    try {
        const user = await User.findByIdAndDelete({_id : userId})
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.send('User deleted successfully!!!')
    }
    catch(err){
        res.status(400).send('Something went wrong!!!')
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

//Get all feed
app.get('/feed', async (req,res) => {
    try {
        const users = await User.find({})
        res.send(users)
    }    catch(err){
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

