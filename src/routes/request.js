const express = require("express");
const { userAuthMiddleware } = require("../middlewares/auth");
const requestRouter = express.Router();

requestRouter.post("/send-connection-request", userAuthMiddleware, (req, res) => {
  res.send({ message: "Connection Request Sent", data: { from: req.user } });
});

 module.exports = requestRouter;
