const express = require("express");
const { userAuthMiddleware } = require("../middlewares/auth");
const ConnectRequestModel = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();
const SAFE_POPULATE_DATA = [
  "firstName",
  "lastName",
  "age",
  "gender",
  "photoUrl",
  "about",
  "skills",
];
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
      }).populate("fromUserId", SAFE_POPULATE_DATA); // Note : if not pass array it will give all details but we have to avoid over-fetching
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
    })
      .populate("fromUserId", SAFE_POPULATE_DATA)
      .populate("toUserId", SAFE_POPULATE_DATA);

    res.status(200).json({
      data: getListOfConnectedPersons.map((item) => {
        if (item.fromUserId.equals(loggedInUser._id)) {
          return item.toUserId;
        }
        return item.fromUserId;
      }),
      // data:getListOfConnectedPersons,
      message: "success",
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

userRouter.get("/feed", userAuthMiddleware, async (req, res) => {
  try {
    // Show All user cards with some certain cards
    // - not seen own card
    // - his connection
    // - ignored , rejected , interested (all ready send)

    const loggedInUser = req.user;
    const { page = 1, limit = 10 } = req.query || {};
    const currentPage = Number(page);
    let currentLimit = Number(limit);
    if (currentLimit > 100) {
      currentLimit = 100;
    }

    const skipCount = (currentPage-1) * Number(currentLimit);

    const connectionRequest = await ConnectRequestModel.find({
      $or: [
        {
          toUserId: loggedInUser._id,
        },
        { fromUserId: loggedInUser._id },
      ],
    }).select(["fromUserId", "toUserId", "status"]); // we dont want into feed

    const hideUsersFromFeed = new Set(); // it has including me , with other (Accepted | Rejected | Ignored) - we can hide all these
    connectionRequest?.forEach((cnr) => {
      hideUsersFromFeed.add(cnr.toUserId.toString());
      hideUsersFromFeed.add(cnr.fromUserId.toString());
    });

    const getUsers = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(SAFE_POPULATE_DATA)
      .skip(skipCount)
      .limit(Number(currentLimit));

    res.status(200).json({
      message: "success",
      count: getUsers.length,
      data: getUsers,
    });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});
module.exports = userRouter;
