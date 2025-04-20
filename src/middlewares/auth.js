const jwt = require("jsonwebtoken");
const User = require("../models/user");
const adminAuthMiddleware = (req, res, next) => {
  const token = "xyz";
  const isAuthenticated = token === "xyz";
  console.log("admin auth middleware running");
  if (!isAuthenticated) {
    res.status(401).send({ message: "Unauthorized" });
  } else {
    next();
  }
};

const userAuthMiddleware = async (req, res, next) => {
  // read the token from the request cookie
  // validate the token
  // find the user in the data
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
      throw new Error("Unauthorized");
    }
    const decodedObj = jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = decodedObj;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user; // add user to the request object
    next();
  } catch (err) {
    res.status(401).send({ message: err.message });
  }
};

module.exports = { adminAuthMiddleware, userAuthMiddleware };
