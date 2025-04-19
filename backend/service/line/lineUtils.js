const Reservation = require("../../models/Reservation");

async function cancelReservation(reservationId, userId) {
    const reservation = await Reservation.findOne({
        _id: reservationId,
        user: userId,
    });

    if (!reservation) {
        throw new Error("Reservation not found or unauthorized");
    }

    await reservation.remove();
    return "Reservation cancelled successfully";
}

module.exports = {
    cancelReservation,
};
