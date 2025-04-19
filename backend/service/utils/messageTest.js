const {
    testFlexMessage,
    buildReservationFlexMessage,
} = require("./flexBuilder");
const User = require("../../models/User");
const Reservation = require("../../models/Reservation");

async function handleTestFlex(event, client) {
    return client.replyMessage(event.replyToken, {
        type: "flex",
        altText: "Your mom",
        contents: testFlexMessage(),
        // type: "text",
        // text: "📭 You don't have any reservations yet.",
    });
}

async function handleViewReservation(event, client) {
    const lineUserId = event.source.userId;

    const user = await User.findOne({ lineUserId });
    if (!user) {
        return client.replyMessage(event.replyToken, {
            type: "text",
            text: "⚠️ Please register before viewing your reservations.",
        });
    }

    const reservations = await Reservation.find({ user: user._id })
        .populate("coworking")
        .sort({ rsDate: -1 })
        .limit(3);

    if (reservations.length === 0) {
        return client.replyMessage(event.replyToken, {
            type: "text",
            text: "📭 You don't have any reservations yet.",
        });
    }

    const flexMessage = buildReservationFlexMessage(reservations);
    return client.replyMessage(event.replyToken, flexMessage);
}

module.exports = {
    handleViewReservation,
    handleTestFlex,
};
