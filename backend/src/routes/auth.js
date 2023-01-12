const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const User = require("../database/model/userModel");
const protect = require("../middleware/IsConnected");
const admin = require("../middleware/IsAdmin");

// @route   POST api/auth/register
// @desc    Enregistrement d'un utilisateur
// @access  Public
router.post("/register", async (req, res) => {
  // On récupère les données du formulaire //

  const { email, password, civility, firstName, lastName, role, telephone } =
    req.body;

  // On vérifie que les champs ne sont pas vides //

  if (!email || !password || !civility || !firstName || !lastName || !role) {
    return res.status(400).json({ error: "Veuillez remplir tous les champs." });
  }

  // On vérifie que l'utilisateur n'existe pas déjà //

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "L'utilisateur existe déjà." });
    }

    // On hash le mot de passe //

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // On crée l'utilisateur //

    user = new User({
      telephone,
      civility,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
    });
    await user.save();

    // On génère le token //

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
});

// @route   POST api/auth/login
// @desc    Connexion d'un utilisateur
// @access  Public
router.post("/login", async (req, res) => {
  // On récupère les données du formulaire //
  const { email, password } = req.body;

  // On vérifie que les champs ne sont pas vides //
  if (!email || !password) {
    return res.status(400).json({ error: "Veuillez remplir tous les champs." });
  }

  // On vérifie que l'utilisateur existe //
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ error: "Cette adresse email n'existe pas." });
    }

    // On vérifie que le mot de passe est correct //
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ error: "Informations de connexion invalides." });
    }

    // On génère le token //

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
});

// @route   GET api/auth/users
// @desc    Récupération de tous les utilisateurs
// @access  Private
router.get("/users", protect, async (req, res) => {
  // On récupère tous les utilisateurs depuis la base de données sans sélectionner le mot de passe //
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur provenant du serveur");
  }
});

//@route    DELETE api/auth/user/:id
//@desc     Supprimer un utilisateur
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
// @desc    Récupération d'un utilisateur par son id
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
// @desc    Modification d'un utilisateur
// @access  Private
router.put("/user/:id", admin, async (req, res) => {
  // On récupère les données du formulaire //

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

  // On vérifie que l'utilisateur existe //
  try {
    let user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "Utilisateur non trouvé" });

    // On modifie l'utilisateur //

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
