 const adminAuthMiddleware = (req, res, next) => {

  const token = "xyz";
  const isAuthenticated = token === "xyz";
  console.log("admin auth middleware running");
  if (!isAuthenticated) {
     res.status(401).send({ message: "Unauthorized" });
  }
  else{
    next();
  }
};

module.exports = { adminAuthMiddleware };

