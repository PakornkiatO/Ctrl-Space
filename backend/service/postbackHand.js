const { handleCancelReservation } = require("./utils/cancelHand");
const { replyText } = require("./utils/lineUtils");
const { startEditSession, handleEditReservation } = require("./utils/editHand");
const Reservation = require("../models/Reservation");

async function postbackHandlers(event, client) {
    const data = new URLSearchParams(event.postback.data);
    const action = data.get("action");
    const reservationId = data.get("id"); // 👈 get reservation ID from postback data
    const lineUserId = event.source.userId;
    const replyToken = event.replyToken;

    switch (action) {
        case "edit":
            startEditSession(lineUserId, reservationId);
            return handleEditReservation(event, client);

        case "cancel":
            return await handleCancelReservation(
                reservationId,
                replyToken,
                client,
                lineUserId
            );

        default:
            return replyText(client, event.replyToken, "❓ Unknown action.");
    }
}


module.exports = { postbackHandlers };
