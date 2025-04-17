const express = require("express");
const { userAuthMiddleware } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const profileRouter = express.Router();
profileRouter.get("/profile/view", userAuthMiddleware, async (req, res) => {
  try {
    res.send({ message: "Profile Data", data: req.user });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

profileRouter.patch("/profile/edit", userAuthMiddleware, async (req, res) => {
  // validate data
  try {
    // validate data
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }
    const loggedInUser = req.user; // getting for middleware
    const bodyData = req.body; // getting data from client side

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = bodyData[key]));
    const data = await loggedInUser.save(); //
    res.json({ message: "Profile Edited successfully", data }); // sending user data to client sid
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

module.exports = profileRouter;
