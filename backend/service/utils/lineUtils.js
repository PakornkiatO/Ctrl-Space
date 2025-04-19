// const Reservation = require("../../models/Reservation");

function replyText(client, token, message) {
    return client.replyMessage(token, {
        type: "text",
        text: message,
    });
}

const userSessions = {}; // In-memory session storage

function getSessionStage(userId) {
    return userSessions[userId]?.stage || null;
}

function setSessionStage(userId, stage) {
    if (!userSessions[userId]) {
        userSessions[userId] = {};
    }
    userSessions[userId].stage = stage;
}

function clearSessionStage(userId) {
    if (userSessions[userId]) {
        delete userSessions[userId].stage;
    }
}
function startEditSession(lineUserId, reservationId) {
    if (!userSessions[lineUserId]) userSessions[lineUserId] = {};
    userSessions[lineUserId].editReservationId = reservationId;
    userSessions[lineUserId].stage = "editing_reservation";
    console.log(userSessions[lineUserId].stage);
}

function getEditSession(lineUserId) {
    return userSessions[lineUserId]?.editReservationId || null;
}

function clearEditSession(lineUserId) {
    if (userSessions[lineUserId]) {
        delete userSessions[lineUserId].editReservationId;
        delete userSessions[lineUserId].stage;
    }
}

module.exports = {
    userSessions,
    getSessionStage,
    setSessionStage,
    clearSessionStage,
    replyText,
    startEditSession,
    getEditSession,
    clearEditSession,
};
