const express = require('express')
const profileRouter = express.Router()

const { userAuth } = require('../middlewares/auth');
const { validateEditProfileData } = require('../utils/validation');


profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
      const user = req.user;
      res.send(user);
    } catch (err) {
      res.status(400).send("ERROR : " + err.message);
    }
  });
  
profileRouter.patch("/profile/edit", userAuth, async (req,res) => {
    try {
        if(!validateEditProfileData(req)){
            throw new Error("Invalid Edit Request!")
        }
        const loggedInUser = req.user

        //Replace details of logged in user with body of update request
        Object.keys(req.body).forEach((field) => (loggedInUser[field] = req.body[field]))

        await loggedInUser.save()

        res.json({
            message : `${loggedInUser.firstName}, your profile has been updated successfully!`,
            data : loggedInUser
        })
    }
    catch (err) {
        res.status(400).send("ERROR : " + err.message);
      }

})

module.exports = profileRouter