const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      minLength: [3, "First name must be at least 3 characters long"],
      maxLength: [20, "First name cannot exceed 20 characters"],
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowerCase: true,
      // match: [/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i, "Invalid email format"],
      validate: (value) => {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email format");
        }
      },
      trim: true,
    },
    password: {
      type: String,
      required: true,
      validate: (value) => {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password is not strong enough");
        }
      },
    },
    age: {
      type: Number,
      min: [18, "You must be at least 18 years old"],
      required: true,
    },
    gender: {
      type: String,
      required: true,
      validate: (value) => {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Invalid gender");
        }
      },
    },
    photoUrl: {
      type: String,
      validate: (value) => {
        if (!validator.isURL(value)) {
          throw new Error("Invalid URL");
        }
      },
      default:
        "https://png.pngtree.com/png-clipart/20231019/original/pngtree-user-profile-avatar-png-image_13369988.png",
    },
    about: {
      type: String,
      default: "This is my about section default",
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

userSchema.index({ firstName: 1, lastName: 1 }); // compound index

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign(
    { _id: user.id, emailId: user.emailId },
    "DevTinder@Hash256",
    { expiresIn: "1d" }
  );
  return token;
};

userSchema.methods.validatePassword = async function (passwordEnteredByUser) {
  const user = this;
  const passwordHash = user.password; // comes from DB
  const isPasswordValid = await bcrypt.compare(
    passwordEnteredByUser,
    passwordHash
  );
  return isPasswordValid;
};
const User = mongoose.model("User", userSchema);
module.exports = User;
