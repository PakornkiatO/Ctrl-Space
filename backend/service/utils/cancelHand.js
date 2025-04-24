const Reservation = require("../../models/Reservation");
const User = require("../../models/User");
const { replyText } = require("../../utils/lineClient");

async function handleCancelReservation(
    reservationId,
    replyToken,
    client,
    lineUserId
) {
    try {
        // First, get user to retrieve token (assume you already stored or can fetch it)
        // const user = await User.findOne({ lineUserId });

        // if (!user || !user.token) {
        //     return replyText(
        //         client,
        //         replyToken,
        //         "❌ User not found or not logged in. Please login first."
        //     );
        // }

        // Call your own deleteReservation API
        // const response = await axios.delete(
        //     `${process.env.BACKEND_API_URL}/reservation/${reservationId}`,
        //     {
        //         headers: {
        //             Authorization: `Bearer ${user.token}`,
        //         },
        //     }
        // );
        const updated = await Reservation.updateOne(
            { _id: reservationId }, // Filter by reservationId
            { $set: { status: "canceled" } } // Set the status to "canceled"
        );

        if (updated.nModified === 0) {
            return replyText(
                client,
                replyToken,
                "⚠️ Reservation not found or already canceled."
            );
        }
        if (response.data.success) {
            return replyText(
                client,
                replyToken,
                "✅ Your reservation has been successfully canceled."
            );
        } else {
            return replyText(
                client,
                replyToken,
                "⚠️ Could not cancel the reservation. Please try again."
            );
        }
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
