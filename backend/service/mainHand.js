const { handleCancelReservation } = require("./line/postbackHand");
const { handleViewReservation, handleTestFlex } = require("./line/messageHand");
// const client = require("../../utils/lineClient");
async function messageHandlers(event, client) {
    const { replyToken, source } = event;
    let echo;
    const text = event.message.text.toLowerCase();
    if (text === "my reservation") return handleViewReservation(event, client);
    if (text === "flex") return handleTestFlex(event, client);
    if (text === "hi") {
        echo = {
            type: "text",
            text: "👋 Hi! How can I help you?",
        };
        return client.replyMessage(replyToken, echo);
    }
    return client.replyMessage(replyToken, echo);
}
// --------------------------------postback handlers----------------------------------//
const handlePostbacks = {
    cancel: handleCancelReservation, // Linking to cancel handler
};
async function postbackHandlers(event, client) {
    const data = new URLSearchParams(event.postback.data);
    const action = data.get("action");

    const handler = handlePostbacks[action];
    if (handler) {
        await handler(event, client);
    } else {
        await client.pushMessage(event.source.userId, {
            type: "text",
            text: `❓ Unknown action: ${action}`,
        });
    }
}

module.exports = {
    messageHandlers,
    postbackHandlers,
};
