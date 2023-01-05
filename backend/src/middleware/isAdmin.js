//check jwt to see if user is admin
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../database/model/userModel");

//check authorization bearer token so see the role of the user
const admin = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    console.log("token found");
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.user.id).select("-password");
      if (req.user.role === "admin") {
        next();
      } else {
        res.status(401).json({ message: "You are not authorized" });
      }
    } catch (error) {
      console.log(error);
      res.status(401).json({ message: "wrong token : " + req.user });
    }
  }
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

module.exports = admin;
