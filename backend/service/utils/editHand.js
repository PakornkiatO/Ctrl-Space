const Reservation = require("../../models/Reservation");
const {
    replyText,
    startEditSession,
    getEditSession,
    clearEditSession,
} = require("../utils/lineUtils");

function promptTimeEdit(replyToken, client) {
    return replyText(
        client,
        replyToken,
        "🛠 Please enter the new time as `HH:mm - HH:mm` (e.g. 13:00 - 15:00)"
    );
}
async function handleEditReservation(event, client) {
    const userId = event.source.userId;
    const reservationId = getEditSession(userId);

    if (!reservationId) {
        return replyText(
            client,
            event.replyToken,
            "❌ No active reservation editing session."
        );
    }

    // Proceed with the edit flow
    return promptTimeEdit(event.replyToken, client);
}

async function handleEditInput(event, client) {
    const text = event.message.text.trim();
    const lineUserId = event.source.userId;
    const reservationId = getEditSession(lineUserId); // Get reservation being edited
    if (!reservationId) return false; // User is not in editing stage
    console.log("is here");

    const match = text.match(/^(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})$/);
    if (!match) {
        return replyText(
            client,
            event.replyToken,
            "❌ Invalid format. Use `HH:mm - HH:mm`"
        );
    }

    const [_, startTime, endTime] = match;
    try {
        await Reservation.findByIdAndUpdate(reservationId, {
            startTime,
            endTime,
        });
        clearEditSession(lineUserId); // Clear edit session
        return replyText(
            client,
            event.replyToken,
            `✅ Updated to ⏰ ${startTime} - ${endTime}`
        );
    } catch (err) {
        console.error("Edit error:", err);
        return replyText(
            client,
            event.replyToken,
            "⚠️ Failed to update. Try again later."
        );
    }
}

// ------------------------------handle cancel reservation------------------------------

module.exports = {
    startEditSession,
    getEditSession,
    handleEditInput,
    promptTimeEdit,
    handleEditReservation,
};
