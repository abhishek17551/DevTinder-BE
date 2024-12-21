const express = require('express')
const connectDB = require('./config/database')
const User = require('./models/user')
const app = express()



app.post("/signup", async (req,res)=>{  
    //Creating a new instance of User model
    const user = new User({
        firstName:"AB De",
        lastName:"Villiers",
        email : "abdev@gmail.com",
        password : "abdev@123"
    })
    try {
        await user.save()
        res.status(201).send("User added successfully");
    }
    catch(err){
        res.status(400).send('Error in adding User:'+err.message)
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

