const express = require("express");
const { connectDB } = require("../src/config/database");
const User = require("./models/user");
const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  const userObject = {
    ...req.body,
  };
  const user = new User(userObject); // creating a new instance of user model for this data
  try {
    await user.save();
    res.send({ message: "User Created" });
  } catch (err) {
    return res.status(400).send({ message: "Internal Server Error" });
  }
});

// Get user by email
app.get("/user", async (req, res) => {
  try {
    const emailId = req.body.emailId
    const users = await User.find({ emailId: emailId });
    if (!users || users.length===0) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send(users); // sending the user object as response to the ap
  } catch (err) {
    console.log("err:::", err);
    res.status(400).send({ message: "Something went wrong" });
  }
});

// feed api [GET]- all users from the DB
app.get("/feed", async (req, res) => {
    try {
      const users = await User.find({}); // with {} => all users from the collection will get
      if (!users || users.length===0) {
        return res.status(404).send({ message: "User not found" });
      }
      res.status(200).send(users); // sending the user object as response to the ap
    } catch (err) {
      console.log("err:::", err);
      res.status(400).send({ message: "Something went wrong" });
    }
  });

app.use("/", (err, req, res, next) => {
  console.log("error:::", err);
  res.status(500).send({ message: "Internal Server Error" });
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
