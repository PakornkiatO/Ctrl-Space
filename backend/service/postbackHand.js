const { handleCancelReservation } = require("./utils/cancelHand");
const { replyText } = require("../utils/lineClient");
const { handleEditReservation } = require("./utils/editHand");
const { startEditSession } = require("./sessionHand");
const { handleCoworkingsPostback } = require("./utils/coworkHand");
const Reservation = require("../models/Reservation");
const { handleCreateReservationPostback } = require("./utils/reserveHand");

async function postbackHandlers(event, client) {
    const data = new URLSearchParams(event.postback.data);
    const action = data.get("action");
    const reservationId = data.get("id");
    // const coworkingId = data.get("coworkingId");
    const lineUserId = event.source.userId;
    const replyToken = event.replyToken;

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
            return handleCoworkingsPostback(event, client, data);
        case "createReservation":
            return handleCreateReservationPostback(event, client, data);
        default:
            return replyText(client, replyToken, "❓ Unknown action.");
    }
}

module.exports = { postbackHandlers };
