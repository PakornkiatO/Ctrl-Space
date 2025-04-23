// sessionHand.js

const userSessions = {}; // In-memory session store

// 🔧 Base functions
function setSessionData(userId, key, value) {
    if (!userSessions[userId]) userSessions[userId] = {};
    userSessions[userId][key] = value;
}

function getSessionData(userId, key) {
    return userSessions[userId]?.[key] || null;
}

function clearSessionData(userId, key) {
    if (userSessions[userId]) {
        delete userSessions[userId][key];
    }
}

// 🎯 Stage helpers
function getSessionStage(userId) {
    return getSessionData(userId, "stage");
}

function setSessionStage(userId, stage) {
    setSessionData(userId, "stage", stage);
}

function clearSessionStage(userId) {
    clearSessionData(userId, "stage");
}

// ✏️ Edit session (built on top of base)
function startEditSession(userId, reservationId) {
    setSessionData(userId, "editReservationId", reservationId);
    setSessionStage(userId, "editing_reservation");
}

function getEditSession(userId) {
    return getSessionData(userId, "editReservationId");
}

function clearEditSession(userId) {
    clearSessionData(userId, "editReservationId");
    clearSessionStage(userId);
}

module.exports = {
    userSessions,

    // base functions
    setSessionData,
    getSessionData,
    clearSessionData,

    // stage helpers
    getSessionStage,
    setSessionStage,
    clearSessionStage,

    // edit-specific helpers
    startEditSession,
    getEditSession,
    clearEditSession,
};
