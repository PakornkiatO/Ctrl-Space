const Reservation = require("../../models/Reservation");
// const User = require("../../models/User");
const {
    buildReservationFlexMessage,
    testFlexMessage,
} = require("./flexBuilder");
// your Flex template above

async function handleTestFlex(event, client) {
    return client.replyMessage(event.replyToken, {
        type: "flex",
        altText: "Brown Cafe Info",
        contents: testFlexMessage(), // 👈 don't forget the parentheses!
    });
}

async function handleViewReservation(event, client) {
    const reservations = await Reservation.find({
        user: user._id,
    }).populate("coworking");

    if (reservations.length === 0) {
        return client.replyMessage(event.replyToken, {
            type: "text",
            text: "📭 You don't have any reservations yet.",
        });
    }

    return client.replyMessage(
        event.replyToken,
        buildReservationFlexMessage(reservations)
    );
}

module.exports = {
    handleViewReservation,
    handleTestFlex,
};
