const uniqueValidator = require("mongoose-unique-validator");
const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Ajouter un utilisateur"],
    },
    date_debut: {
      type: Date,
      required: [true, "Ajouter une date de début"],
    },
    date_fin: {
      type: Date,
      required: [true, "Ajouter une date de fin"],
    },
    motif: {
      type: String,
      required: [true, "Ajouter un motif"],
    },
    room_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: [true, "Ajouter une salle"],
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);
bookingSchema.plugin(uniqueValidator, {
  message: "{PATH} already exists",
});

module.exports = mongoose.model("Booking", bookingSchema);
