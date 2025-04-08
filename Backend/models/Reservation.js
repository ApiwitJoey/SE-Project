const mongoose = require("mongoose");

const ReservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
    required: true,
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// TTL Index: Automatically deletes reservations after the day has passed
ReservationSchema.index({ date: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Reservation", ReservationSchema);
