const Reservation = require("../../models/Reservation");
const User = require("../../models/User");
const { replyText } = require("../../utils/lineClient");

async function handleCancelReservation(reservationId, replyToken, client) {
    try {
        const updated = await Reservation.updateOne(
            {
                _id: reservationId,
                status: { $ne: "canceled" }, // Ensure it's not already canceled
            }, // Filter by reservationId
            { $set: { status: "canceled" } } // Set the status to "canceled"
        );
        if (updated.nModified === 0) {
            return replyText(
                client,
                replyToken,
                "⚠️ Reservation not found or already canceled."
            );
        }
        return replyText(
            client,
            replyToken,
            "✅ Your reservation has been successfully canceled."
        );
    } catch (err) {
        // console.error("Cancel API error:", err.response?.data || err.message);
        return replyText(
            client,
            replyToken,
            "⚠️ Failed to cancel reservation. Please try again."
        );
    }
}

module.exports = {
    handleCancelReservation,
};
