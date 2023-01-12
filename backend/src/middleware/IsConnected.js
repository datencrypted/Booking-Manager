const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../database/model/userModel");
// VERIFICATION DE L'AUTHENTICITÉ DU TOKEN//

const protect = asyncHandler(async (req, res, next) => {
  let token;

  //On verifie si le token est présent dans le header//

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    //On enleve le mot Bearer du token puis on le decode//

    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
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

module.exports = protect;
