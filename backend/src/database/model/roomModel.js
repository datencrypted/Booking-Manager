const uniqueValidator = require("mongoose-unique-validator");
const mongoose = require("mongoose");
//use bookingmodel schema
const bookingSchema = require("./bookingModel");

const roomSchema = mongoose.Schema(
  {
    nom: {
      type: String,
      required: [true, "Ajoutez un nom"],
      uniqueCaseInsensitive: true,
      unique: true,
    },
    code: {
      type: Number,
      required: [true, "Ajoutez un code"],
    },
    etage: {
      type: Number,
      required: [true, "Ajoutez un étage"],
    },
    capacite: {
      type: Number,
      required: [true, "Ajoutez une capacité"],
    },
    equipements: {
      type: Object,
      required: [true, "Ajoutez des équipements"],
    },
    reservations: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
      required: false,
    },
    etat: {
      enum: ["disponible", "indisponible"],
      type: String,
      default: "disponible",
    },
  },
  { timestamps: true }
);
roomSchema.plugin(uniqueValidator, {
  message: "{PATH} already exists",
});

module.exports = mongoose.model("Room", roomSchema);
