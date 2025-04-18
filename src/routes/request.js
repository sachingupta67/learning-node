const express = require("express");
const { userAuthMiddleware } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");
const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuthMiddleware,
  async (req, res) => {
    // send the response with the dat
    try {
      // fromUserId => logged in user , will get from userMiddleware
      // toUserId => user id of the user to whom request is sent
      // status => pending

      const fromUser = req.user; // logged in user
      const fromUserId = fromUser._id; // who send the request
      const toUserId = req.params.toUserId; // to whom request is sent
      const status = req.params.status; // pending

      // this api is only for   ignored or interested not for accepted we need to validated that first
      const allowedStatus = ["ignored", "interested"];

      if (!allowedStatus.includes(status)) {
        throw new Error(`Invalid status: ${status}`);
      }

      // will check there is existing connection request or not

      const existingConnectionRequest = await ConnectionRequestModel.findOne({
        $or: [
          { toUserId, fromUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        throw new Error("Connection request already exists");
      }

      //  toUserId : we have to check this userId is present in DB or not

      const isUserPresent = await User.findById(toUserId);
      if (!isUserPresent) {
        throw new Error("User not found");
      }

      // toUserId and fromUserId should not be same person | means we can not send request to our self
      console.log("check:::",{
        fromUserId,
        toUserId,
        x:fromUserId === toUserId,
      })
      // if (fromUserId === toUserId) {
      //   throw new Error("You can not send request to yourself");
      // }

      // save the request | now we have to create a new instance of request model and save it
      const connectedRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });

      const requestInfo = await connectedRequest.save();
      res.json({
        message:'success',
        data: requestInfo,
      });
    } catch (err) {
      res.status(404).send({ message: err.message });
    }
  }
);

module.exports = requestRouter;
