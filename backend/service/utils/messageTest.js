const {
    testFlexMessage,
    buildReservationFlexMessage,
} = require("./flexBuilder");
const User = require("../../models/User");
const Reservation = require("../../models/Reservation");
const { replyText } = require("../../utils/lineClient");

async function handleTestFlex(event, client) {
    return client.replyMessage(event.replyToken, {
        type: "flex",
        altText: "Your mom",
        contents: testFlexMessage(),
    });
}

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

    const reservations = await Reservation.find({ user: user._id })
        .populate("coworking")
        .sort({ rsDate: -1 })
        .limit(3);

    if (reservations.length === 0) {
        replyText(
            client,
            event.replyToken,
            "📭 You don't have any reservations yet."
        );
    }

    const flexMessage = buildReservationFlexMessage(reservations);
    return client.replyMessage(event.replyToken, flexMessage);
}

module.exports = {
    handleViewReservation,
    handleTestFlex,
};
