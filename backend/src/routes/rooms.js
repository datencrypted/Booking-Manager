const express = require("express");
const router = express.Router();
const Room = require("../database/model/roomModel");
const protect = require("../middleware/IsConnected");
const admin = require("../middleware/IsAdmin");

// @route   POST api/rooms/create
// @desc    Créer une salle
// @access  Private
router.post("/create", protect, admin, async (req, res) => {
  // On récupère les données du formulaire //

  const { nom, code, etage, capacite, equipements } = req.body;
  try {
    // On vérifie que les champs ne sont pas vides //

    if (!nom || !code || !etage || !capacite || !equipements) {
      return res
        .status(400)
        .json({ error: "Veuillez remplir tous les champs." });
    }
    // On vérifie que la salle n'existe pas déjà //
    let room = await Room.findOne({ nom });
    if (room) {
      return res
        .status(400)
        .json({ error: "La salle " + nom + " existe déjà." });
    }
    // On vérifie que l'emplacement n'existe pas déjà //
    let emplacement = await Room.findOne({
      $and: [{ etage: etage }, { code: code }],
    });
    if (emplacement) {
      return res.status(400).json({
        error: "L'emplacement existe déjà.",
        emplacement:
          " Etage: " + etage + " Code: " + code + " Nom: " + emplacement.nom,
      });

      // On crée la salle //
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
});

// @route   GET api/rooms
// @desc    Récupérer toutes les salles
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    // Récupération des salles avec les réservations //
    const rooms = await Room.find().populate("reservations");
    res.json(rooms);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// @route   GET api/rooms/:id
// @desc    Récupérer une salle par son id
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
// @desc    Modifier une salle
// @access  Private
router.put("/:id", protect, admin, async (req, res) => {
  // On récupère les données du formulaire //
  const { nom, code, etage, capacite, equipements } = req.body;
  const roomFields = {};
  if (nom) roomFields.nom = nom;
  if (code) roomFields.code = code;
  if (etage) roomFields.etage = etage;
  if (capacite) roomFields.capacite = capacite;
  if (equipements) roomFields.equipements = equipements;
  try {
    // On vérifie que les champs ne sont pas vides //
    let room = await Room.findById(req.params.id);

    // On vérifie que la salle n'existe pas déjà //
    if (!room) return res.status(404).json({ msg: "Salle non trouvée" });
    let emplacement = await Room.findOne({
      $and: [{ etage: etage }, { code: code }],
    });
    // On vérifie que l'emplacement n'existe pas déjà //
    if (emplacement) {
      return res.status(400).json({
        error: "L'emplacement existe déjà.",
        emplacement:
          " Etage: " + etage + " Code: " + code + " Nom: " + emplacement.nom,
      });
    }
    // On modifie la salle //
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
// @desc    Supprimer une salle
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
