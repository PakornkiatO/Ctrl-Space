const { cancelReservation } = require("./lineUtils");
const { handleRegisterFlow } = require("./loginHand");

async function handleCancelReservation(event, client) {
    const data = new URLSearchParams(event.postback.data);
    const reservationId = data.get("id"); // Get reservation ID from the postback data
    try {
        const result = await cancelReservation(
            reservationId,
            event.source.userId
        );

        return client.replyMessage(event.replyToken, {
            type: "text",
            text: result,
        });
    } catch (error) {
        return client.replyMessage(event.replyToken, {
            type: "text",
            text: `❌ Error: ${error.message}`, // Error message
        });
    }
}
module.exports = {
    handleCancelReservation,
};
