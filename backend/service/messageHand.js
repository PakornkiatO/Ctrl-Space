const User = require("../models/User");
const Reservation = require("../models/Reservation");
const {
    handleLoginStart,
    handleEmailInput,
    handlePasswordInput,
    getSessionStage,
    handleLogout,
} = require("./utils/loginHand");

const { handleEditInput } = require("./utils/editHand");

const {
    handleTestFlex,
    handleViewReservation,
} = require("./utils/messageTest");

async function messageHandlers(event, client) {
    const text = event.message.text.trim().toLowerCase();
    const userId = event.source.userId;
    const existingUser = await User.findOne({ lineUserId: userId });

    const stage = getSessionStage(userId);
    console.log(stage);
    if (stage) {
        if (stage === "waiting_for_email") {
            await handleEmailInput(event, client, event.message.text.trim());
            return;
        } else if (stage === "waiting_for_password") {
            await handlePasswordInput(event, client, event.message.text.trim());
            return;
        } else if (stage === "editing_reservation") {
            await handleEditInput(event, client);
            return;
        }
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
    if (text === "logout") return handleLogout(event, client);
    if (text === "flex") return handleTestFlex(event, client);
    if (text === "login") return handleLoginStart(event, client);
    if (text === "reservation") return handleViewReservation(event, client);

    return client.replyMessage(event.replyToken, {
        type: "text",
        text: "🤖 I didn't understand that. hehehe.",
    });
}
module.exports = {
    messageHandlers,
};
