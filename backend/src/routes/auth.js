const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const User = require("../database/model/userModel");
const protect = require("../middleware/IsConnected");
const admin = require("../middleware/IsAdmin");

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
router.post(
  "/register",
  [
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password, civility, firstName, lastName, role, telephone } =
      req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ error: "L'utilisateur existe déjà." });
      }
      user = new User({
        telephone,
        civility,
        firstName,
        lastName,
        email,
        password,
        role,
      });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      const payload = {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          civility: user.civility,
          role: user.role,
          email: user.email,
        },
      };
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRES_IN,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ errors: err });
    }
  }
);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "Cette adresse email n'existe pas." });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ error: "Informations de connexion invalides." });
      }

      const payload = {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          civility: user.civility,
          role: user.role,
          email: user.email,
        },
      };
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRES_IN,
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Erreur provenant du serveur");
    }
  }
);

// @route   GET api/auth/users
// @desc    Get all users
// @access  Private
router.get("/users", protect, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur provenant du serveur");
  }
});

//@route    DELETE api/auth/user/:id
//@desc     Delete a user
//@access   Private
router.delete("/user/:id", admin, async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "Utilisateur non trouvé" });
    await User.findByIdAndRemove(req.params.id);
    res.json({ msg: "Utilisateur supprimé" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur provenant du serveur");
  }
});

// @route   GET api/auth/user/:id
// @desc    Get user by ID
// @access  Private
router.get("/user/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ msg: "Utilisateur non trouvé" });
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur provenant du serveur");
  }
});

// @route   PUT api/auth/user/:id
// @desc    Update user
// @access  Private
router.put("/user/:id", admin, async (req, res) => {
  const { civility, firstName, lastName, email, role, password, telephone } =
    req.body;
  const userFields = {};
  if (civility) userFields.civility = civility;
  if (firstName) userFields.firstName = firstName;
  if (lastName) userFields.lastName = lastName;
  if (email) userFields.email = email;
  if (password) userFields.password = password;
  if (role) userFields.role = role;
  if (telephone) userFields.telephone = telephone;
  try {
    console.log(userFields);
    let user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "Utilisateur non trouvé" });
    user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: userFields },
      { new: true }
    ).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur provenant du serveur");
  }
});

module.exports = router;
