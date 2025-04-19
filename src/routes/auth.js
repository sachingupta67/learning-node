const express = require("express");
const bcrypt = require("bcrypt");
const validator = require("validator");
const { validateSignupData } = require("../utils/validation");
const User = require("../models/user");
const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    // 1. Never trust req.body , do validation before saving it in DB
    validateSignupData(req);
    const { firstName, lastName, emailId, password, gender, age } = req.body;
    //  2. encrypt the password before saving it in DB
    const passwordHash = await bcrypt.hash(password, 10);
    const userObject = {
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      gender,
      age,
    };
    const user = new User(userObject); // creating a new instance of user model for this data
    const info = await user.save();
    res.send({ message: "User Created", data: info });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!emailId || !password) {
      throw new Error("EmailId and Password are required");
    } else if (!validator.isEmail(emailId)) {
      throw new Error("Invalid EmailId");
    }
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Credentials are not valid");
    }
    const isPasswordValid = await user.validatePassword(password); // offload the logic to user model
    if (isPasswordValid) {
      // Create a JWT token and send it in the response
      const token = await user.getJWT();
      // add cookie
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000), // 1 day
        // secure: true, // work with https only
        // httpOnly: true, // work with http only
        sameSite: "none",
      });
      res.send({ message: "Login Successful", data: user });
    } else {
      throw new Error("Credentials are not valid");
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

authRouter.post("/logout", (_req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send({ message: "Logout Successful" });
});
module.exports = authRouter;
