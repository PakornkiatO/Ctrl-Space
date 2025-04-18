const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
    rsDate: {
        type: Date,
        require: [true, 'Please select a reservation date']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        require: true
    },
    coworking: {
        type: mongoose.Schema.ObjectId,
        ref: 'Coworking',
        require: [true, 'Please select a Co-working space']
    },
    createAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Reservation', ReservationSchema);