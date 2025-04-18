const { handleProfile, handleMenu } = require("./messageHandler");
const { handleview } = require("./postbackHandler");
async function messageHandlers(event, client) {
    const { replyToken, source } = event;
    const text = event.message.text;

    if (text.toLowerCase() === "profile") {
        return handleProfile(source.userId, client);
    }

    if (text.toLowerCase() === "menu") {
        return handleMenu(replyToken, client);
    }

    const echo = {
        type: "text",
        text: `You said: ${text}`,
    };

    return client.replyMessage(replyToken, echo);
}

const handlePostbacks = {
    view: handleview,
    // add more here as needed
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
