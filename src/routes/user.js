const express = require('express')
const userRouter = express.Router()

const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');

const detailsArray = ['firstName', 'lastName','photoUrl','age', 'gender', 'about', 'skills']

//Get pending connection requests from logged in user
userRouter.get("/user/requests/received", userAuth, async (req,res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            toUserId : loggedInUser._id,
            status : "interested"
        }).populate("fromUserId", detailsArray)

        res.json({
            message : "Data fetched successfully",
            data : connectionRequests
        })
    }
    catch (err) {
        req.statusCode(400).send("ERROR: " + err.message);
      }
})

//Get connections of a logged in User
userRouter.get("/user/connections", userAuth, async (req,res) => {
    try {
        const loggedInUser = req.user

        const connectionRequests = await ConnectionRequest.find({
            $or : [
                {toUserId : loggedInUser._id, status : 'accepted'},
                {fromUserId : loggedInUser._id, status : 'accepted'}
            ] //Check if user exists in 'from' or 'to' ID in CR collection
        }).populate("fromUserId",detailsArray)
        .populate("toUserId", detailsArray) 

        const connectionsData = connectionRequests.map((request) => {
            if(request.fromUserId.toString() === loggedInUser._id.toString()) {
                return request.toUserId
            }
            return request.fromUserId
        })

        res.json({
            data : connectionsData
        })
    }
    catch(err) {
        res.status(400).send({ message: err.message });
    }
})


module.exports = userRouter