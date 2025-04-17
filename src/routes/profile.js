const express = require("express");
const { userAuthMiddleware } = require("../middlewares/auth");
const profileRouter = express.Router();
profileRouter.get("/profile", userAuthMiddleware, async (req, res) => {
  try {
    res.send({ message: "Profile Data", data: req.user });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

module.exports = profileRouter;
