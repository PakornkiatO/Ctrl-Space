const User = require("../models/User");
const { handleLoginRequest } = require("./handlers/loginHand");
const { handleEditInput } = require("./handlers/editHand");
const { replyText } = require("../utils/line");
const {
    handleViewReservation,
    handleCreateReservationMsg,
} = require("./handlers/reserveHand");
const { handleCoworkingsMsg } = require("./handlers/coworkHand");
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
        console.log(userId);
        replyText(
            client,
            event.replyToken,
            "🤖 Sorry, you are not user yet. Try contact admin but it still the same though. hehehehe."
        );
    }

    // 👉 Command Handling
    if (text === "coworking" || text === "get coworking")
        return await handleCoworkingsMsg(event, client);
    if (text === "reservation") return handleViewReservation(event, client);
    // if (text === "logout") return handleLogout(event, client);
    // if (text === "flex") return handleTestFlex(event, client);
    // if (text === "login") return handleLoginRequest(event, client);

    return replyText(
        client,
        event.replyToken,
        "🤖 hehehe, I didn't understand that"
    );
}

module.exports = {
    messageHandlers,
};
