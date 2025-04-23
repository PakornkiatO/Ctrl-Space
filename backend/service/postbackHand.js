const { handleCancelReservation } = require("./utils/cancelHand");
const { replyText } = require("../utils/lineClient");
const { handleEditReservation } = require("./utils/editHand");
const { startEditSession } = require("./sessionHand");
const { handleGetCoworkings } = require("./utils/coworkHand");
const Reservation = require("../models/Reservation");

async function postbackHandlers(event, client) {
    const data = new URLSearchParams(event.postback.data);
    const action = data.get("action");
    const reservationId = data.get("id");
    const lineUserId = event.source.userId;
    const replyToken = event.replyToken;
    const page = parseInt(params.get("page")) || 1;

    switch (action) {
        case "edit":
            startEditSession(lineUserId, reservationId); // Not async, no need to await
            return await handleEditReservation(event, client); // ❗ Fixed missing return

        case "cancel":
            return await handleCancelReservation(
                reservationId,
                replyToken,
                client,
                lineUserId
            );
        case "getCoworking":
            return handleGetCoworkings(event, client, page);

        default:
            return replyText(client, replyToken, "❓ Unknown action.");
    }
}

module.exports = { postbackHandlers };
