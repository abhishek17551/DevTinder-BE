const express = require('express')
const userRouter = express.Router()

const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');


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

//Get feed for an user
userRouter.get("/feed", userAuth, async (req,res) => {
    try {
        const loggedInUser = req.user

        const page = parseInt(req.query.page) || 1
        let limit = parseInt(req.query.limit) || 10
        limit = limit > 50 ? 50 : limit
        const skip = (page-1)*limit

        //Sent & Received connection requests
        const connectionRequests = await ConnectionRequest.find({
            $or : [
                {fromUserId : loggedInUser._id}, {toUserId : loggedInUser._id}
            ]
        }).select("fromUserId toUserId")

        const usersNotOnFeed = new Set();

        connectionRequests.forEach((req) => {
            usersNotOnFeed.add(req.fromUserId.toString())
            usersNotOnFeed.add(req.toUserId.toString())
        })

        const users = await User.find({
            $and : [
                {_id : {$nin : Array.from(usersNotOnFeed)}},
                {_id : {$ne : loggedInUser._id}}
            ]
        }).select(detailsArray).skip(skip).limit(limit)

        res.json({
            data : users
        })
        
    }
    catch (err) {
        res.status(400).json({ message: err.message });
      }
})


 module.exports = userRouter