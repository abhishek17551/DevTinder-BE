const express = require('express')
const connectDB = require('./config/database')
const User = require('./models/user')
const app = express()

//Applies to all requests to express server
//Converts JSON requests on server to JS readable objects  
app.use(express.json())


app.post("/signup", async (req,res)=>{  
    //Creating a new instance of User model
    const user = new User(req.body)
    try {
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
    console.error("Database cannot be connected!!");
  });

