const express = require('express')
const connectDB = require('./config/database')
const cookieParser = require('cookie-parser')

const app = express()

//Applies to all requests to express server
//Converts JSON requests on server to JS readable objects  
app.use(express.json())
app.use(cookieParser())


const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')


app.use("/", authRouter);
app.use("/", profileRouter);


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

