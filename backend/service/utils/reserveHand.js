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
        status: "active",
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
        status: "actives", // adjust if needed
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

    const [_, dateStr, startTimeStr, endTimeStr] = match;
    const timezone = "Asia/Bangkok";

    const now = moment.tz(timezone);
    const start = moment.tz(
        `${dateStr} ${startTimeStr}`,
        "YYYY-MM-DD HH:mm",
        timezone
    );
    const end = moment.tz(
        `${dateStr} ${endTimeStr}`,
        "YYYY-MM-DD HH:mm",
        timezone
    );

    // ❌ Invalid time or end <= start
    if (!start.isValid() || !end.isValid() || end.isSameOrBefore(start)) {
        clearSessionStage(lineUserId);
        return replyText(client, event.replyToken, "⛔ Invalid time range.");   
    }

    // ❌ Can't reserve in the past (only if same day and before current time)
    // ❌ Can't reserve in the past (any day before current time)
    if (start.isBefore(now)) {
        clearSessionStage(lineUserId);
        return replyText(
            client,
            event.replyToken,
            "⛔ You can't reserve in the past."
        );
    }

    // ✅ Allow future dates!

    // ❌ Outside coworking hours
    const openTime = moment.tz(
        `${dateStr} ${coworking.open_hour}`,
        "YYYY-MM-DD HH:mm",
        timezone
    );
    const closeTime = moment.tz(
        `${dateStr} ${coworking.close_hour}`,
        "YYYY-MM-DD HH:mm",
        timezone
    );

    if (start.isBefore(openTime) || end.isAfter(closeTime)) {
        clearSessionStage(lineUserId);
        return replyText(
            client,
            event.replyToken,
            `⛔ Outside working hours (${coworking.open_hour} - ${coworking.close_hour}).`
        );
    }

    try {
        const newReservation = new Reservation({
            rsDate: start.clone().startOf("day").toDate(),
            startTime: start.format("HH:mm"),
            endTime: end.format("HH:mm"),
            user: user._id,
            coworking: coworkingId,
        });

        await newReservation.save();

        await replyText(
            client,
            event.replyToken,
            `✅ Reservation created from ${startTimeStr} to ${endTimeStr} on ${dateStr} at ${coworking.name}`
        );

        clearSessionStage(lineUserId);
    } catch (err) {
        console.error(err);
        return replyText(
            client,
            event.replyToken,
            "❌ Failed to create reservation."
        );
    }
}

const timezone = "Asia/Bangkok";

function isLessThan(inputTimeStr, minutes) {
    const startMoment = getStartMoment(inputTimeStr);
    const now = moment.tz(timezone);

    const diff = startMoment.diff(now, "minutes");
    return diff < minutes && diff >= 0;
}

function isMoreThan(inputTimeStr, minutes) {
    const startMoment = getStartMoment(inputTimeStr);
    const now = moment.tz(timezone);

    const diff = startMoment.diff(now, "minutes");
    return diff > minutes;
}

// 🔧 helper
function getStartMoment(inputTimeStr) {
    const [datePart, timeRange] = inputTimeStr.split(" ");
    const [startTime] = timeRange.split("-");
    const fullDateStr = `${datePart} ${startTime}`;
    return moment.tz(fullDateStr, "YYYY/MM/DD HH:mm", timezone);
}

module.exports = {
    handleViewReservation,
    handleCreateReservationPostback,
    handleCreateReservationMsg,
};
