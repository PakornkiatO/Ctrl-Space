const {
    handleLoginStart,
    handleEmailInput,
    handlePasswordInput,
    getSessionStage,
} = require("./line/loginHand");
const User = require("../models/User");

const { handleViewReservation, handleTestFlex } = require("./line/messageHand");

async function messageHandlers(event, client) {
    const text = event.message.text.trim().toLowerCase();
    const userId = event.source.userId;
    const existingUser = await User.findOne({ lineUserId: userId });

    const stage = getSessionStage(userId);
    console.log(stage);
    if (stage) {
        // const stage = userSessions[userId].stage;
        if (stage === "waiting_for_email") {
            await handleEmailInput(event, client, event.message.text.trim());
        } else if (stage === "waiting_for_password") {
            await handlePasswordInput(event, client, event.message.text.trim());
        }
        return;
    }

    if (!existingUser) {
        if (text !== "login") {
            await client.replyMessage(event.replyToken, {
                type: "text",
                text: "Who are you, login first talk after.",
            });
            return;
        }
    }
    // 👉 Handle login flow stages (email/password input)

    // Commands
    if (text === "flex") return handleTestFlex(event, client);
    if (text === "login") return handleLoginStart(event, client);
    if (text === "my reservation") return handleViewReservation(event, client);

    return client.replyMessage(event.replyToken, {
        type: "text",
        text: "🤖 I didn't understand that. hehehe.",
    });
}

// --------------------------------postback handlers----------------------------------//

const { handleCancelReservation } = require("./line/postbackHand");
async function postbackHandlers(event, client) {
    const data = new URLSearchParams(event.postback.data);
    const action = data.get("action");

    const handlers = {
        cancel: handleCancelReservation,
    };

    const handler = handlers[action];
    if (handler) {
        await handler(event, client);
    } else {
        await client.replyMessage(event.replyToken, {
            type: "text",
            text: `❓ Unknown action: ${action}`,
        });
    }
}

module.exports = {
    messageHandlers,
    postbackHandlers,
};
