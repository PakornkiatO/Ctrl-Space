// models/Booking.js
const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
    coworkingSpace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CoworkingSpace",
        required: true,
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // the person who made the booking
    },
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // other users involved in the booking
        },
    ],
    date: {
        type: Date,
        required: true,
    },
    startTime: {
        type: String, // e.g. '09:00'
        required: true,
    },
    endTime: {
        type: String, // e.g. '12:00'
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "pending",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Booking", BookingSchema);
