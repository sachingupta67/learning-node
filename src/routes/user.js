const express = require("express");
const { userAuthMiddleware } = require("../middlewares/auth");
const ConnectRequestModel = require("../models/connectionRequest");
const userRouter = express.Router();

// Purpose : Get All pending connection request for logged User
userRouter.get(
  "/user/requests/received",
  userAuthMiddleware,
  async (req, res) => {
    try {
      // it should be logged in - userAuthMiddleware
      const loggedInUser = req.user;
      if (!loggedInUser._id) {
        return res.status(400).json({ message: "Not a valid user" });
      }
      const pendingConnectionRequests = await ConnectRequestModel.find({
        toUserId: loggedInUser._id,
        status: "interested",
      }).populate("fromUserId", [
        "firstName",
        "lastName",
        "photoUrl",
        "skills",
        "about",
      ]); // Note : if not pass array it will give all details but we have to avoid over-fetching
      if (!pendingConnectionRequests) {
        return res
          .status(404)
          .json({ message: "There is no pending request", data: [] });
      }
      return res
        .status(200)
        .json({ data: pendingConnectionRequests, message: "success" });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
);

// fetch the list of user who are connected with me
userRouter.get("/user/connections", userAuthMiddleware, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const getListOfConnectedPersons = await ConnectRequestModel.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "age",
      "gender",
      "photoUrl",
      "about",
      "skills",
    ]);
    res.status(200).json({
      data: getListOfConnectedPersons.map(item=>item.fromUserId),
      message: "success",
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
module.exports = userRouter;
