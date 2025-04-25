const mongoose = require("mongoose");

const ShopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      unique: true,
      trim: true,
      maxlength: [50, "Name can not be more than 50 characters"],
    },
    address: {
      type: String,
      required: [true, "Please add an address"],
    },
    telephone: {
      type: String,
      required: [true, "Please add a telephone number"],
      unique: true,
      match: [/^\+?[0-9\s\-\(\)]{7,16}$/, "Please add a valid phone number"],
    },
    openTime: {
      type: String,
      required: [true, "Please add an opening time"],
      match: [
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Please enter a valid time in HH:mm format",
      ],
    },
    closeTime: {
      type: String,
      required: [true, "Please add a closing time"],
      match: [
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Please enter a valid time in HH:mm format",
      ],
    },
    likes: [{type: mongoose.Schema.Types.ObjectId , ref: 'User'}],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
  }
);

// Reverse populate with virtuals
ShopSchema.virtual("reservations", {
  ref: "Reservation",
  localField: "_id",
  foreignField: "shop",
  justOne: false,
});

module.exports = mongoose.model("Shop", ShopSchema);
