const Reservation = require('../models/Reservation');

exports.getReservation = async (req, res, next) => {
    let query;

    if(req.user.role !== 'admin') query = Reservation.find({user: req.user.id})
    else query = Reservation.find();

    try {
        const reservations = await query;

        res.status(200).json({success: true, data: reservations});
    } catch (err) {
        console.log(err);
        res.status(500).json({success: false, msg: `Cannot find reservation`});
    }
}