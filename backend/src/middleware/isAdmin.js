const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../database/model/userModel");

//VERIFICATION DU ROLE DE L'UTILISATEUR//
const admin = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    //On enleve le mot Bearer du token puis on le decode//
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      //On cherche l'utilisateur dans la base de données//

      req.user = await User.findById(decoded.user.id).select("-password");

      //On verifie si l'utilisateur est admin//

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
  //Si il n'y a pas de token renvoyer une erreur//
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

module.exports = admin;
