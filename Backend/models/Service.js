const mongoose = require("mongoose");

// added feature (US2-4) written by jean
const ServiceSchema = new mongoose.Schema({
    // one (shop) to many (this)
    shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
    name: String,
    price: Number,
    // Target Body Area
    targetArea: {
        type: String,
        enum: [
            'Head & Shoulder', 
            'Foot', 
            'Neck-Shoulder-Back', 
            'Chair', 
            'Abdominal', 
            'Hand & Arm', 
            'Leg', 
            'Full Body'
        ]
    },
    // Massage Technique
    massageType: {
        type: String,
        enum: [
            'Thai', 
            'Swedish', 
            'Oil/Aromatherapy', 
            'Herbal Compress',
            'Deep Tissue', 
            'Sports', 
            'Office Syndrome',
            'Shiatsu', 
            'Lomi-Lomi', 
            'Trigger Point',
            'Others'
        ]
    },
    details: String
})

module.exports = mongoose.model("Service", ServiceSchema);