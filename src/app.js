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
    res.status(500).send(err);
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
