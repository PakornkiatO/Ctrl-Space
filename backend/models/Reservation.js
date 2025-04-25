const mongoose = require("mongoose");

const ReservationSchema = new mongoose.Schema({
    rsDate: {
        type: Date,
        required: [true, "Please select a reservation date"]
    },
    startTime: {
        type: String,
        required: [true, "Please provide a start time (e.g., 09:00)"]
    },
    endTime: {
        type: String,
        required: [true, "Please provide an end time (e.g., 17:00)"]
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    coworking: {
        type: mongoose.Schema.ObjectId,
        ref: "Coworking",
        required: [true, "Please select a Co-working space"]
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    notified: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ["active", "canceled", "expired"], // Add possible statuses
        default: "active"
    },
});

module.exports = mongoose.model("Reservation", ReservationSchema);
