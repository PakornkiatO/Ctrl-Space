const { handleProfile, handleMenu } = require("./messageHandler");
const { handleview } = require("./postbackHandler");
async function messageHandlers(event, client) {
    const { replyToken, source } = event;
    const text = event.message.text.toLowerCase();

    if (text === "profile") return handleProfile(source.userId, client);

    if (text === "menu") return handleMenu(replyToken, client);
    if (text === "view") return handleview(event, client);

    return client.replyMessage(replyToken, echo);
}

const handlePostbacks = {
    view: handleview,
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
