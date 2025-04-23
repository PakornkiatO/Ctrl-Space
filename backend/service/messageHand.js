const User = require("../models/User");

const { handleLoginRequest } = require("./utils/loginHand");
const { handleEditInput } = require("./utils/editHand");
const { replyText } = require("../utils/lineClient");
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
        if (stage === "editing_reservation") {
            await handleEditInput(event, client);
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
    // 👉 Handle login flow stages (email/password input)

    // Commands
    if (text === "logout") return handleLogout(event, client);
    if (text === "flex") return handleTestFlex(event, client);
    if (text === "login") return handleLoginRequest(event, client);
    if (text === "reservation") return handleViewReservation(event, client);
    replyText(client, event.replyToken, "🤖 I didn't understand that. hehehe.");
}
// function startEditSession(lineUserId, reservationId) {
//     if (!userSessions[lineUserId]) userSessions[lineUserId] = {};
//     userSessions[lineUserId].editReservationId = reservationId;
//     userSessions[lineUserId].stage = "editing_reservation";
//     console.log(userSessions[lineUserId].stage);
// }
// function getEditSession(lineUserId) {
//     return userSessions[lineUserId]?.editReservationId || null;
// }
// function clearEditSession(lineUserId) {
//     if (userSessions[lineUserId]) {
//         delete userSessions[lineUserId].editReservationId;
//         delete userSessions[lineUserId].stage;
//     }
// }
// function getSessionStage(userId) {
//     return userSessions[userId]?.stage || null;
// }

module.exports = {
    messageHandlers,
    startEditSession,
    getEditSession,
    clearEditSession,
    getSessionStage,
};
