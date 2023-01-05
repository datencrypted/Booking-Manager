const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const Booking = require("../database/model/bookingModel");
const protect = require("../middleware/IsConnected");
const admin = require("../middleware/IsAdmin");
const moment = require("moment");
const Room = require("../database/model/roomModel");

// @route   POST api/bookings/create
// @desc    Create a booking
// @access  Private
router.post(
  "/create",
  [
    check("date_debut", "Please add a date").not().isEmpty(),
    check("date_fin", "Please add a date").not().isEmpty(),
    check("user", "Please add a user").not().isEmpty(),
    check("motif", "Please add a reason").not().isEmpty(),
    check("room_id", "Please add a room").not().isEmpty(),
  ],
  protect,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { date_debut, date_fin, motif, room_id, user } = req.body;
    try {
      let booking = await Booking.findOne({
        // Check a booking doesn't overlap with another booking date and room
        date_debut: { $lte: date_fin },
        date_fin: { $gte: date_debut },
        room_id,
      });
      if (booking) {
        return res.status(400).json({
          error:
            "La salle est déjà réservée pour la période du " +
            moment(booking.date_debut).format("DD/MM/YYYY") +
            " au " +
            moment(booking.date_fin).format("DD/MM/YYYY"),
        });
      }
      booking = new Booking({
        user,
        date_debut,
        date_fin,
        motif,
        room_id,
      });
      await booking.save();
      //update room reservation
      const room = await Room.findByIdAndUpdate(room_id, {
        $push: { reservations: booking._id },
      });

      res.json(booking);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Server Error" });
    }
  }
);

// @route   GET api/bookings
// @desc    Get all bookings
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
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
// @desc    Get booking by ID
// @access  Private
router.get("/:id", protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ msg: "Réservation introuvable" });
    }
    res.json(booking);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Réservation introuvable" });
    }
    res.status(500).send("Server error");
  }
});

// @route   PUT api/bookings/:id
// @desc    Update a booking
// @access  Private
router.put(
  "/:id",
  [
    check("date_debut", "Please add a start date").not().isEmpty(),
    check("date_fin", "Please add an end date").not().isEmpty(),
    check("salle", "Please add a room").not().isEmpty(),
    check("utilisateur", "Please add a user").not().isEmpty(),
  ],
  protect,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { date_debut, date_fin, salle, utilisateur } = req.body;
    const bookingFields = {};
    if (date_debut) bookingFields.date_debut = date_debut;
    if (date_fin) bookingFields.date_fin = date_fin;
    if (salle) bookingFields.salle = salle;
    if (utilisateur) bookingFields.utilisateur = utilisateur;
    try {
      let booking = await Booking.findById(req.params.id);
      if (!booking) {
        return res.status(404).json({ msg: "Réservation introuvable" });
      }
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
  }
);

// @route   DELETE api/bookings/:id
// @desc    Delete a booking
// @access  Private
router.delete("/:id", protect, async (req, res) => {
  try {
    let booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ msg: "Réservation introuvable" });
    }
    await Booking.findByIdAndRemove(req.params.id);
    //update room reservation
    const room = await Room.findByIdAndUpdate(booking.room_id, {
      $pull: { reservations: booking._id },
    });
    res.json({ msg: "Réservation supprimée" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Réservation introuvable" });
    }
    res.status(500).send("Server error");
  }
});

module.exports = router;
