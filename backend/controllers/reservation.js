const Reservation = require("../models/Reservation");
const Coworking = require("../models/Reservation");

exports.getReservations = async (req, res, next) => {
    let query;
    if (req.user.role !== "admin")
        query = Reservation.find({ user: req.user.id }).populate({
            path: "coworking",
            select: "name address tel",
        });
    else {
        if (req.params.coworkingId) {
            console.log(req.params.coworkingId);
            query = Reservation.find({
                coworking: req.params.coworkingId,
            }).populate({ path: "coworking", select: "name address tel" });
        } else
            query = Reservation.find().populate({
                path: "coworking",
                select: "name address tel",
            });
    }
    try {
        const reservations = await query;

        res.status(200).json({ success: true, data: reservations });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            msg: `Cannot find reservation`,
        });
    }
};

exports.addReservation = async (req, res, next) => {
    try {
        req.body.coworking = req.params.coworkingId;

        const coworking = await Coworking.find({ _id: req.params.coworkingId });

        if (!coworking)
            return res.status(404).json({
                success: false,
                msg: `No Co-working with the id of ${req.params.coworkingId}`,
                data: coworking,
            });

        const reservation = await Reservation.create(req.body);
        res.status(200).json({ success: true, data: reservation });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            msg: `Cannot create Resevation`,
        });
    }
};

exports.deleteReservation = async (req, res) => {
    const { reservationId } = req.params; // Assuming reservationId is passed in URL params
    const reservation = await Reservation.findOne({
        _id: reservationId,
        user: req.user.id,
    });
    if (!reservation) {
        return res
            .status(403)
            .json({ message: "Unauthorized or reservation not found" });
    }

    try {
        await reservation.remove();
        res.status(200).json({ message: "Reservation deleted" });
    } catch (err) {
        console.error("Error deleting reservation:", err);
        res.status(500).json({ message: "Error deleting reservation" });
    }
};
