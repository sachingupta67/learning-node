const express = require("express");
const validator = require("validator");
const bcrypt = require("bcrypt");
const { connectDB } = require("../src/config/database");
const User = require("./models/user");
const { validateSignupData } = require("./utils/validation");
const cookieParser = require("cookie-parser");
const app = express();
const jwt = require("jsonwebtoken");
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
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      // Create a JWT token and send it in the response
      const token = jwt.sign(
        { _id: user.id, emailId: user.emailId },
        "DevTinder@Hash256"
      );
      // add cookie
      res.cookie("token", token);
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

app.get("/profile", async (req, res) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    if(!token){
     return res.status(401).send({ message: "Unauthorized" });
    }
    const decodedValue = jwt.verify(token, "DevTinder@Hash256");
    if (decodedValue) {
      const {_id} = decodedValue;
      const user = await User.findById(_id);
      if (!user) {
        throw new Error("User not found");
      }
      res.send({ message: "Profile Data", data: user ,token});
    } else {
      throw new Error("Token is not valid");
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// Get user by email
app.get("/user", async (req, res) => {
  try {
    const emailId = req.body.emailId;
    const users = await User.find({ emailId: emailId });
    if (!users || users.length === 0) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send(users); // sending the user object as response to the ap
  } catch (err) {
    res.status(400).send({ message: "Something went wrong" });
  }
});

app.delete("/user", async (req, res) => {
  try {
    const uuid = req.body.uuid;
    const users = await User.findByIdAndDelete(uuid);
    if (!users || users.length === 0) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send({ message: "User Deleted" }); // sending the user object as response to the ap
  } catch (err) {
    res.status(400).send({ message: "Something went wrong" });
  }
});

// update user by uuid
app.patch("/user/:userId", async (req, res) => {
  const data = req.body;
  const _id = req.params.userId;
  try {
    const ALLOWED_FIELDS = [
      "firstName",
      "lastName",
      "password",
      "age",
      "photoUrl",
      "about",
      "skills",
      "gender",
    ]; // we can avoid to update emailId or un-necessary fields
    const isAllowed = Object.keys(data).every((field) =>
      ALLOWED_FIELDS.includes(field)
    );
    if (!isAllowed) {
      return res.status(400).send({ message: "Some of fields not allowed" });
    }
    if (data.skills.length > 5) {
      throw new Error("Skills cannot be more than 5");
    }
    const userData = await User.findByIdAndUpdate(
      _id,
      { ...data },
      { returnDocument: "after", runValidators: true }
    );

    if (!userData) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send({ message: "User Updated", data: userData });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// feed api [GET]- all users from the DB
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({}); // with {} => all users from the collection will get
    if (!users || users.length === 0) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send(users); // sending the user object as response to the ap
  } catch (err) {
    res.status(400).send({ message: "Something went wrong" });
  }
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
