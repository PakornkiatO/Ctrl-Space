const Reservation = require("../../models/Reservation");
const moment = require("moment"); // Make sure to include moment for proper date handling
const { replyText } = require("../../utils/lineClient");
const { getEditSession, clearEditSession } = require("../sessionHand"); // ✅ Now imports from sessionHand

function promptTimeEdit(replyToken, client) {
    return replyText(
        client,
        replyToken,
        "📅 Please enter the new date and time in this format:\n\n`YYYY-MM-DD HH:mm - HH:mm`\n\nExample: `2025-04-26 13:00 - 15:00`"
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

    return promptTimeEdit(event.replyToken, client);
}

async function handleEditInput(event, client) {
    const text = event.message.text.trim();
    const userId = event.source.userId;
    const reservationId = getEditSession(userId);

    if (!reservationId) return false;

    const match = text.match(
        /^(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})$/ // regex for date and time
    );
    if (!match) {
        clearEditSession(userId); // Clear session if format is invalid
        return replyText(
            client,
            event.replyToken,
            "❌ Invalid format. Use `YYYY-MM-DD HH:mm - HH:mm`"
        );
    }

    const [_, date, startTime, endTime] = match;

    // Parse the start and end times with moment.js and ensure they are in the correct format
    const startDateTime = moment(
        `${date} ${startTime}`,
        "YYYY-MM-DD HH:mm"
    ).toDate();
    const endDateTime = moment(
        `${date} ${endTime}`,
        "YYYY-MM-DD HH:mm"
    ).toDate();

    try {
        // Update reservation with correct date and time
        await Reservation.findByIdAndUpdate(reservationId, {
            rsDate: date, // Store the reservation date correctly
            startTime: startDateTime, // Store startTime as Date
            endTime: endDateTime, // Store endTime as Date
            notified: false,
        });

        clearEditSession(userId);

        return replyText(
            client,
            event.replyToken,
            `✅ Updated reservation:\n📅 ${date}\n⏰ ${startTime} - ${endTime}`
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

module.exports = {
    handleEditInput,
    handleEditReservation,
};
