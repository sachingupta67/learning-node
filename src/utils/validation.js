const validator = require("validator");
const validateSignupData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("First Name and Last Name are required");
  }
  else if (firstName.length < 3 || lastName.length < 3) {
    throw new Error("First Name and Last Name must be at least 3 characters long");
  }
  else if (firstName.length > 20 || lastName.length > 20) {
    throw new Error("First Name and Last Name must be less than 20 characters");
  } else if (!emailId || !password) {
    throw new Error("EmailId and Password are required");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Invalid EmailId");
  } else if (password.length < 8) {
    throw new Error("Password must be at least 8 characters long");
  }
};

module.exports = {
  validateSignupData,
};