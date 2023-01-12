const express = require("express");
const router = express.Router();
const Booking = require("../database/model/bookingModel");
const protect = require("../middleware/IsConnected");
const moment = require("moment");
const Room = require("../database/model/roomModel");

// @route   POST api/bookings/create
// @desc    Créer une réservation
// @access  Private
router.post("/create", protect, async (req, res) => {
  const { date_debut, date_fin, motif, room_id, user } = req.body;
  try {
    let booking = await Booking.findOne({
      // Vérifie si la salle est déjà réservée pour la période demandée
      date_debut: { $lte: date_fin },
      date_fin: { $gte: date_debut },
      room_id,
    });

    // Si la salle est déjà réservée, on renvoie une erreur //
    if (booking) {
      return res.status(400).json({
        error:
          "La salle est déjà réservée pour la période du " +
          moment(booking.date_debut).format("DD/MM/YYYY") +
          " au " +
          moment(booking.date_fin).format("DD/MM/YYYY"),
      });
    }

    // On créer la réservation //

    booking = new Booking({
      user,
      date_debut,
      date_fin,
      motif,
      room_id,
    });
    await booking.save();

    // On ajoute la réservation à la salle //
    const room = await Room.findByIdAndUpdate(room_id, {
      $push: { reservations: booking._id },
    });

    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// @route   GET api/bookings
// @desc    Récupérer toutes les réservations
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    // On récupère toutes les réservations //

    const bookings = await Booking.find()
      .populate("user")
      .select("-password")
      .populate("room_id");

    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/bookings/:id
// @desc    Récupérer une réservation par son id
// @access  Private
router.get("/:id", protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ msg: "Réservation introuvable" });
    }
    res.json(booking);
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Réservation introuvable" });
    }
    res.status(500).send("Server error");
  }
});

// @route   PUT api/bookings/:id
// @desc    Modifier une réservation
// @access  Private
router.put("/:id", protect, async (req, res) => {
  // On récupère les données du formulaire //

  const { date_debut, date_fin, salle, utilisateur } = req.body;
  const bookingFields = {};
  if (date_debut) bookingFields.date_debut = date_debut;
  if (date_fin) bookingFields.date_fin = date_fin;
  if (salle) bookingFields.salle = salle;
  if (utilisateur) bookingFields.utilisateur = utilisateur;
  try {
    // On récupère la réservation //

    let booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ msg: "Réservation introuvable" });
    }

    ////////////////////PAS FINI////////////////////
    /////VERIFIER SI LA SALLE EST DEJA RESERVEE AVANT DE MODIFIER/////

    booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { $set: bookingFields },
      { new: true }
    );
    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   DELETE api/bookings/:id
// @desc    Supprimer une réservation
// @access  Private
router.delete("/:id", protect, async (req, res) => {
  try {
    // On récupère la réservation //
    let booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ msg: "Réservation introuvable" });
    }
    //Supprimer la réservation
    await Booking.findByIdAndRemove(req.params.id);
    //Mettre à jour la salle
    const room = await Room.findByIdAndUpdate(booking.room_id, {
      $pull: { reservations: booking._id },
    });
    res.json({ msg: "Réservation supprimée" });
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Réservation introuvable" });
    }
    res.status(500).send("Server error");
  }
});

module.exports = router;
