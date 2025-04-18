const mongoose = require("mongoose");

const CoworkingSpaceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    location: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        country: { type: String, required: true },
        coordinates: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true },
        },
    },
    amenities: [String],
    openingHours: {
        weekdays: {
            open: { type: String, required: true }, // e.g. "08:00"
            close: { type: String, required: true },
        },
        weekends: {
            open: { type: String },
            close: { type: String },
        },
    },
    capacity: {
        type: Number,
        default: 0,
    },
    pricePerHour: {
        type: Number,
        required: true,
    },
    contactInfo: {
        phone: String,
        email: String,
        website: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// ✅ Add virtual `id` field

module.exports = mongoose.model("CoworkingSpace", CoworkingSpaceSchema);
