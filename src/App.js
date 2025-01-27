const express = require('express')
const connectDB = require('./config/database')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const http = require('http')


const app = express()

//Applies to all requests to express server
//Converts JSON requests on server to JS readable objects  
app.use(cors({
  origin : "http://localhost:5173",
  credentials : true
}))
app.use(express.json())
app.use(cookieParser())


const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const requestRouter = require('./routes/request')
const userRouter = require('./routes/user')
const initializeSocket = require('./utils/socket')


app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter)

const server = http.createServer(app)
initializeSocket(server)


connectDB()
  .then(() => {
    console.log("Database connection established...");
    server.listen(7777, () => {
      console.log("Server is successfully listening on port 7777...");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!"+err.message);
  });

