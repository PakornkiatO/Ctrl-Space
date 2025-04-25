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
    // console.log(userId);
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
        replyText(
            client,
            event.replyToken,
            '🤖 Sorry, you are not user yet. Try "login" but it still the same though. hehehehe.'
        );
    }

    // 👉 Command Handling
    if (text === "coworking" || text === "get coworking")
        return await handleCoworkingsMsg(event, client);
    if (text === "logout") return handleLogout(event, client);
    if (text === "flex") return handleTestFlex(event, client);
    if (text === "login") return handleLoginRequest(event, client);
    if (text === "reservation") return handleViewReservation(event, client);

    return replyText(
        client,
        event.replyToken,
        "🤖 hehehe, I didn't understand that"
    );
}

module.exports = {
    messageHandlers,
};
