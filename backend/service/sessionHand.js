// sessionHand.js

function setSession(userSession, lineUserId, key, value) {
    if (!userSession[lineUserId]) userSession[lineUserId] = {};
    userSession[lineUserId][key] = value;
}

function getSession(userSession, lineUserId, key) {
    return userSession[lineUserId]?.[key] || null;
}

function clearSessionKey(userSession, lineUserId, key) {
    if (userSession[lineUserId]) {
        delete userSession[lineUserId][key];
    }
}

function clearAllSession(userSession, lineUserId) {
    delete userSession[lineUserId];
}

module.exports = {
    setSession,
    getSession,
    clearSessionKey,
    clearAllSession,
};
