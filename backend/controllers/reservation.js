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

exports.getReservation = async (req, res, next) => {
    try {
        const reservation = await Reservation.findById(req.params.id).populate({
            path: "coworking",
            select: "name province tel opening_hours",
        });

        if (!reservation)
            return res.status(404).json({
                success: false,
                msg: `No reservation with the id of ${req.params.id}`,
            });

        res.status(200).json({ success: true, data: reservation });
    } catch (err) {
        console.log(err);

        res.status(500).json({
            success: false,
            msg: "Cannot find reservation",
        });
    }
};

exports.addReservation = async (req, res, next) => {
    try {
        req.body.coworking = req.params.coworkingId;

        const coworking = await Coworking.find({ _id: req.params.coworkingId });

        if (!coworking) return res.status(404).json({
                success: false,
                msg: `No Co-working with the id of ${req.params.coworkingId}`,
                data: coworking,
            });

        const userReservations = await Reservation.countDocuments({
            user: req.body.user,
            status: "active", // adjust based on your statuses
        });

        if (userReservations >= 3) {
            return res.status(400).json({
                success: false,
                msg: `❌ You already have 3 active reservations. Please cancel or complete one before adding more.`,
            });
        }
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

exports.updateReservation = async (req, res, next) => {
    try {
        let reservation = await Reservation.findById(req.params.id);

        if (!reservation)
            return res.status(404).json({
                success: false,
                msg: `No reservation with id of ${req.params.id}`,
            });

        if (
            reservation.user.toString() !== req.user.id &&
            req.user.role !== "admin"
        )
            return res.status(401).json({
                success: false,
                msg: `User ${req.user.id} is not authorized to update this reservation`,
            });

        reservation = await Reservation.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        res.status(200).json({ success: true, data: reservation });
    } catch (err) {
        console.log(err);

        res.status(500).json({
            success: false,
            msg: "Cannot update reservation",
        });
    }
};

exports.deleteReservation = async (req, res, next) => {
    try {
        const reservation = await Reservation.findById(req.params.id);

        if (!reservation)
            return res.status(404).json({
                success: false,
                msg: `No reservation with id of ${req.params.id}`,
            });

        if (
            reservation.user.toString() !== req.user.id &&
            req.user.role !== "admin"
        )
            return res.status(401).json({
                success: false,
                msg: `User ${req.user.id} is not authorized to delete this reservation`,
            });

        await reservation.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        console.log(err);

        res.status(500).json({
            success: false,
            msg: "Cannot delete reservation",
        });
    }
};
