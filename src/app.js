const express = require("express");
const { connectDB } = require("../src/config/database");
const User = require("./models/user");
const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  const userObject = {
   ...req.body
  };
  const user = new User(userObject); // creating a new instance of user model for this data
  try {
    await user.save();
    res.send({ message: "User Created" });
  } catch (err) {
    return res.status(400).send({ message: "Internal Server Error" });
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
