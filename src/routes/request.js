const express = require('express')
const requestRouter = express.Router()

const { userAuth } = require('../middlewares/auth')
const User = require('../models/user')
const ConnectionRequest = require('../middlewares/connectionRequest')


requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req,res) => {
    try {
        const fromUserId = req.user._id
        const toUserId = req.params.toUserId
        const status = req.params.status

        const allowedStatus = ['interested','ignored']
    
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message: "Invalid status type: " + status})
        }
    
        const toUser = await User.findById(toUserId)
    
        if(!toUser) {
            return res.status(400).json({message: "User not found"})
        }
    
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or : [
                {fromUserId, toUserId},
                {fromUserId : toUserId, toUserId:fromUserId}
            ]
        })
    
        if(existingConnectionRequest) {
            return res.status(400).send({ message: "Connection Request Already Exists!!" });
        }
    
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        })
    
        const data = await connectionRequest.save()
    
        res.json({
            message : data
        })
    }
    catch (err) {
        res.status(400).send("ERROR: " + err.message);
      }
})

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req,res) => {
    try {
        const loggedInUser = req.user;
        const {status, requestId} = req.params

        const allowedStatus = ['accepted','rejected']
        if(!allowedStatus.includes(status)) {
            return res.status(400).json({message : 'Status not allowed!'})
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id : requestId,
            toUserId : loggedInUser._id,
            status : 'interested'
        })

        if(!connectionRequest){
            return res.status(404).json({message : 'Connection Request not found'})
        }

        connectionRequest.status = status

        const data = await connectionRequest.save()

        res.json({
            message : "Connection request "+status,
            data : data
        })
    }
    catch(err) {
        res.status(400).send("ERROR: " + err.message);
    }
})

module.exports = requestRouter