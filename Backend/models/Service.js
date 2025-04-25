const mongoose = require("mongoose");

// added feature (US2-4) written by jean
const ServiceSchema = new mongoose.Schema({
    // one (shop) to many (this)
    shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
    name: String,
    price: Number,
    type: String,
    details: String
})

module.exports = mongoose.model("Service", ServiceSchema);