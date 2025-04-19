const Reservation = require("../../models/Reservation");
const User = require("../../models/User");
const { replyText } = require("./lineUtils");

async function handleCancelReservation(
    reservationId,
    replyToken,
    client,
    lineUserId
) {
    try {
        // First, find the user by lineUserId
        const user = await User.findOne({ lineUserId });

        if (!user) {
            return replyText(
                client,
                replyToken,
                "❌ User not found. Please register first."
            );
        }

        // Then find reservation by _id and user ObjectId
        const reservation = await Reservation.findOne({
            _id: reservationId,
            user: user._id,
        });

        if (!reservation) {
            return replyText(
                client,
                replyToken,
                "❌ Reservation not found or unauthorized."
            );
        }

        await Reservation.deleteOne({ _id: reservationId });

        return replyText(
            client,
            replyToken,
            "❌ Your reservation has been successfully canceled."
        );
    } catch (err) {
        console.error("Cancel error:", err);
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
