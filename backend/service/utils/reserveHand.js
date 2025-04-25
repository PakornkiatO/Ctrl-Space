const { viewReservationFlex } = require("./flexBuilder");
const User = require("../../models/User");
const Reservation = require("../../models/Reservation");
const { replyText } = require("../../utils/lineClient");
const axios = require("axios");
const Coworking = require("../../models/Coworking");
const moment = require("moment"); // Only using moment without moment-timezone
const {
    setTempData,
    getTempData,
    clearSessionStage,
    setSessionStage,
} = require("../sessionHand"); // ✅ Pull from sessionHand

async function handleViewReservation(event, client) {
    const lineUserId = event.source.userId;
    const user = await User.findOne({ lineUserId });
    if (!user) {
        replyText(
            client,
            event.replyToken,
            "⚠️ Please register before viewing your reservations."
        );
    }

    const reservations = await Reservation.find({
        user: user._id,
        status: { $in: ["active", "pending"] },
    })
        .populate("coworking")
        .sort({ rsDate: -1 })
        .limit(3);

    if (reservations.length === 0) {
        replyText(
            client,
            event.replyToken,
            "📭 You don't have any reservations yet."
        );
        return;
    }
    const flexMessage = viewReservationFlex(reservations);
    return client.replyMessage(event.replyToken, flexMessage);
}

async function handleCreateReservationPostback(event, client, data) {
    const lineUserId = event.source.userId;
    const user = await User.findOne({ lineUserId });

    if (!user) {
        return replyText(
            client,
            event.replyToken,
            "⚠️ Please login before reserving."
        );
    }
    const coworkingId = data.get("coworkingId");
    const activeReservations = await Reservation.countDocuments({
        user: user._id,
        status: { $in: ["active", "pending"] }, // adjust if needed
    });
    if (activeReservations >= 3) {
        return replyText(
            client,
            event.replyToken,
            "⚠️ You already have 3 active reservations. Please cancel or complete one before making a new reservation."
        );
    }
    // Ask user to input date and time
    await replyText(
        client,
        event.replyToken,
        `📅 Please send your reservation in this format:\n\nYYYY-MM-DD HH:mm - HH:mm\nExample:\n2025-04-30 09:00 - 12:00`
    );
    // ✅ Save stage in session (implement this in your sessionHand.js)
    setSessionStage(lineUserId, "creating_reservation");
    setTempData(lineUserId, { coworkingId });
}

async function handleCreateReservationMsg(event, client) {
    const text = event.message.text;
    const lineUserId = event.source.userId;
    const user = await User.findOne({ lineUserId });
    const temp = getTempData(lineUserId);
    const coworkingId = temp?.coworkingId;

    if (!user || !coworkingId) {
        return replyText(
            client,
            event.replyToken,
            "⚠️ Invalid session. Please try again."
        );
    }
    const coworking = await Coworking.findById(coworkingId);
    if (!coworking) {
        return replyText(
            client,
            event.replyToken,
            "❌ Coworking space not found."
        );
    }

    // Parse input format
    const match = text.match(
        /^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}) - (\d{2}:\d{2})$/
    );
    if (!match) {
        return replyText(
            client,
            event.replyToken,
            "❌ Invalid format. Please use:\nYYYY-MM-DD HH:mm - HH:mm"
        );
    }
    const date = match[1];
    const startTime = match[2];
    const endTime = match[3];
    const start = moment(`${date} ${startTime}`, "YYYY-MM-DD HH:mm");
    const end = moment(`${date} ${endTime}`, "YYYY-MM-DD HH:mm");

    // 🕘 Parse openingHour string like "9.00-21.00"
    const [openRaw, closeRaw] = coworking.opening_hours.split("-");
    const openTime = openRaw.replace(".", ":"); // e.g. "9.00" => "9:00"
    const closeTime = closeRaw.replace(".", ":"); // e.g. "21.00" => "21:00"

    // 📆 Use moment to build opening and closing moments
    const opening = moment(`${date} ${openTime}`, "YYYY-MM-DD HH:mm");
    const closing = moment(`${date} ${closeTime}`, "YYYY-MM-DD HH:mm");
    if (date) {
        if (date < moment().format("YYYY-MM-DD")) {
            // ❌ Reject if date is in the past
            return replyText(
                client,
                event.replyToken,
                "⛔ Invalid date. Yak yorn vela or nong."
            );
        }
        if (start.isBefore(opening) || end.isAfter(closing)) {
            // ❌ Reject if time is outside working hours
            return replyText(
                client,
                event.replyToken,
                `⛔ Outside working hours (${openTime} - ${closeTime}).`
            );
        }
    }

    // Create reservation via your API
    try {
        // Save the reservation to the database
        const newReservation = new Reservation({
            rsDate: date,
            startTime: start, // Store as ISO string
            endTime: end, // Store as ISO string
            user: user._id,
            coworking: coworkingId,
        });
        await newReservation.save();

        await replyText(
            client,
            event.replyToken,
            `✅ Reservation created from ${start.format(
                "HH:mm"
            )} to ${end.format("HH:mm")} on ${start.format("MMMM Do")}`
        );
    } catch (err) {
        console.error(err.response?.data || err.message);
        return replyText(
            client,
            event.replyToken,
            "❌ Failed to create reservation."
        );
    }

    clearSessionStage(lineUserId);
}

module.exports = {
    handleViewReservation,
    handleCreateReservationPostback,
    handleCreateReservationMsg,
};
