const User = require("../../models/User");
const bcrypt = require("bcryptjs");

let userSessions = {}; // Temp session tracking

async function handleLoginStart(event, client) {
    const userId = event.source.userId;
    const existingUser = await User.findOne({ lineUserId: userId });

    if (existingUser) {
        await client.replyMessage(event.replyToken, {
            type: "text",
            text: "✅ You are already logged in.",
        });
        return;
    }

    userSessions[userId] = { stage: "waiting_for_email" };

    await client.replyMessage(event.replyToken, {
        type: "text",
        text: "📧 Please enter your email to log in.",
    });
}

async function handleEmailInput(event, client, email) {
    const userId = event.source.userId;

    if (!userSessions[userId]) return;

    userSessions[userId].email = email;
    userSessions[userId].stage = "waiting_for_password";

    await client.replyMessage(event.replyToken, {
        type: "text",
        text: "🔒 Please enter your password.",
    });
}

async function handlePasswordInput(event, client, password) {
    const userId = event.source.userId;
    const session = userSessions[userId];
    if (!session) return;

    const user = await User.findOne({ email: session.email }).select(
        "+password"
    );
    if (!user) {
        await client.replyMessage(event.replyToken, {
            type: "text",
            text: "❌ Email not found.",
        });
        delete userSessions[userId];
        return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        await client.replyMessage(event.replyToken, {
            type: "text",
            text: "❌ Incorrect password.",
        });
        delete userSessions[userId];
        return;
    }

    user.lineUserId = userId;
    await user.save();

    await client.replyMessage(event.replyToken, {
        type: "text",
        text: "✅ Login successful! You're now connected to your account.",
    });

    delete userSessions[userId];
}

function getSessionStage(userId) {
    return userSessions[userId]?.stage;
}

module.exports = {
    handleLoginStart,
    handleEmailInput,
    handlePasswordInput,
    getSessionStage,
};
