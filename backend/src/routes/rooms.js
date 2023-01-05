const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const Room = require("../database/model/roomModel");
const protect = require("../middleware/IsConnected");
const admin = require("../middleware/IsAdmin");

// @route   POST api/rooms/create
// @desc    Create a room
// @access  Private
router.post(
  "/create",
  [
    check("nom", "Please add a name").not().isEmpty(),
    check("code", "Please add a code").not().isEmpty(),
    check("etage", "Please add a floor").not().isEmpty(),
    check("capacite", "Please add a capacity").not().isEmpty(),
    check("equipements", "Please add equipments").not().isEmpty(),
  ],
  protect,
  admin,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { nom, code, etage, capacite, equipements } = req.body;
    try {
      let room = await Room.findOne({ nom });
      if (room) {
        return res
          .status(400)
          .json({ error: "La salle " + nom + " existe déjà." });
      }
      let emplacement = await Room.findOne({
        $and: [{ etage: etage }, { code: code }],
      });
      if (emplacement) {
        return res.status(400).json({
          error: "L'emplacement existe déjà.",
          emplacement:
            " Etage: " + etage + " Code: " + code + " Nom: " + emplacement.nom,
        });
      }
      room = new Room({
        nom,
        code,
        etage,
        capacite,
        equipements,
      });
      await room.save();
      res.json(room);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   GET api/rooms
// @desc    Get all rooms
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    // Récupération des salles avec les réservations //
    const rooms = await Room.find().populate("reservations");
    // Réponse en json des salles //
    res.json(rooms);

  } catch (err) {
    // S'il y a une erreur, on affiche l'erreur dans la console //
    // et on renvoie un message d'erreur avec le code 500 //
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/rooms/:id
// @desc    Get room by ID
// @access  Private
router.get("/:id", protect, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ msg: "Salle non trouvée" });
    }
    res.json(room);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Salle non trouvée" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/rooms/:id
// @desc    Update room
// @access  Private
router.put("/:id", protect, admin, async (req, res) => {
  //update only if room emplacement is not taken and room name is not taken
  const { nom, code, etage, capacite, equipements } = req.body;
  const roomFields = {};
  if (nom) roomFields.nom = nom;
  if (code) roomFields.code = code;
  if (etage) roomFields.etage = etage;
  if (capacite) roomFields.capacite = capacite;
  if (equipements) roomFields.equipements = equipements;
  try {
    let room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ msg: "Salle non trouvée" });
    let emplacement = await Room.findOne({
      $and: [{ etage: etage }, { code: code }],
    });
    if (emplacement) {
      return res.status(400).json({
        error: "L'emplacement existe déjà.",
        emplacement:
          " Etage: " + etage + " Code: " + code + " Nom: " + emplacement.nom,
      });
    }
    room = await Room.findOneAndUpdate(
      { _id: req.params.id },
      { $set: roomFields },
      { new: true }
    );
    res.json(room);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   DELETE api/rooms/:id
// @desc    Delete room
// @access  Private
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    let room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ msg: "Salle non trouvée" });
    await Room.findByIdAndRemove(req.params.id);
    res.json({ msg: "Salle supprimée" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
