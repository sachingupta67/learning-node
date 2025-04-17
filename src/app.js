const express = require("express");
const validator = require("validator");
const bcrypt = require("bcrypt");
const { connectDB } = require("../src/config/database");
const User = require("./models/user");
const { validateSignupData } = require("./utils/validation");
const cookieParser = require("cookie-parser");
const app = express();
const jwt = require("jsonwebtoken");
const { userAuthMiddleware } = require("./middlewares/auth");
app.use(express.json());
app.use(cookieParser());
app.post("/login", async (req, res) => {
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
      });
      res.send({ message: "Login Successful", data: user });
    } else {
      throw new Error("Credentials are not valid");
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});
app.post("/signup", async (req, res) => {
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

app.get("/profile", userAuthMiddleware, async (req, res) => {
  try {
    res.send({ message: "Profile Data", data: req.user });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

app.post("/send-connection-request", userAuthMiddleware, (req, res) => {
  res.send({ message: "Connection Request Sent", data: { from: req.user } });
});

app.use("/", (err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

connectDB()
  .then((res) => {
    console.log("res::: DB Success");
    app.listen(8080, () => {
      console.log("Server Running at Port : 8080......");
    });
  })
  .catch((err) => {
    console.log("err:::", JSON.parse(err));
  });
