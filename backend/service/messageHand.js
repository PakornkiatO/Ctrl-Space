const User = require("../models/User");
const { handleLoginRequest } = require("./utils/loginHand");
const { handleEditInput } = require("./utils/editHand");
const { replyText } = require("../utils/lineClient");
const {
    handleTestFlex,
    handleViewReservation,
    handleCreateReservationMsg,
} = require("./utils/reserveHand");
const { handleCoworkingsMsg } = require("./utils/coworkHand");
const { getSessionStage } = require("./sessionHand"); // ✅ Pull from sessionHand

async function messageHandlers(event, client) {
    const text = event.message.text.trim().toLowerCase();
    const userId = event.source.userId;
    const existingUser = await User.findOne({ lineUserId: userId });

    const stage = getSessionStage(userId);
    console.log(stage);
    if (stage) {
        if (stage === "editing_reservation") {
            await handleEditInput(event, client);
            return;
        }
        if (stage === "creating_reservation") {
            await handleCreateReservationMsg(event, client);
            return;
        }
    }
    if (!existingUser) {
        if (text !== "login") {
            await replyText(
                client,
                event.replyToken,
                "⚠️ You need to log in first. Type 'login' to start."
            );
            return;
        }
    }

    // 👉 Command Handling
    if (text === "coworking spaces" || text === "get coworking")
        return await handleCoworkingsMsg(event, client);
    if (text === "logout") return handleLogout(event, client);
    if (text === "flex") return handleTestFlex(event, client);
    if (text === "login") return handleLoginRequest(event, client);
    if (text === "reservation") return handleViewReservation(event, client);

    return replyText(
        client,
        event.replyToken,
        "🤖 I didn't understand that. hehehe."
    );
}

module.exports = {
    messageHandlers,
};
