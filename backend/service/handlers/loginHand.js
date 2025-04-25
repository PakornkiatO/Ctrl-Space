const User = require("../../models/User");
const axios = require("axios");
const qs = require("qs");
const { sendTokenResponse } = require("../../controllers/auth");

const { loginRequestFlex } = require("./flexBuilder");

const { lineCallbackUrl, replyText } = require("../../utils/line");

async function lineCallback(req, res) {
    const code = req.query.code;
    // console.log("-------------------------------------------");
    // console.log("Authorization Code:", code);
    // console.log("LINE Login ID:", process.env.LINELOGIN_CHANNEL_ID);
    // console.log("LINE Login Secret:", process.env.LINELOGIN_CHANNEL_SECRET);
    // console.log("Redirect URI:", lineCallbackUrl);
    // console.log("-------------------------------------------");
    try {
        const tokenRes = await axios.post(
            "https://api.line.me/oauth2/v2.1/token", // LINE token API
            qs.stringify({
                grant_type: "authorization_code",
                code,
                redirect_uri: lineCallbackUrl, // The same callback URL you registered
                client_id: process.env.LINELOGIN_CHANNEL_ID, // Your LINE Channel ID
                client_secret: process.env.LINELOGIN_CHANNEL_SECRET, // Your LINE Channel Secret
            }),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded", // This indicates URL-encoded data
                },
            }
        );
        const accessToken = tokenRes.data.access_token;
        // console.log("Access Token:", accessToken);
        // Get LINE profile
        const profileRes = await axios.get("https://api.line.me/v2/profile", {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        const { userId, displayName, pictureUrl } = profileRes.data;
        console.log("LINE Profile:", profileRes.data);
        // Check if LINE user already exists
        let user = await User.findOne({ lineUserId: userId });
        // console.log("User found:", user);
        if (!user) {
            // Optional: delay full registration if no email yet
            user = await User.create({
                name: displayName,
                lineUserId: userId,
                avatar: pictureUrl,
                role: "user", // or your default role
            });
        }

        // Login using JWT like your normal login
        sendTokenResponse(user, 200, res);
    } catch (err) {
        // console.error(err.response?.data || err.message);
        console.error("LINE login error:", {
            message: err.message,
            data: err.response?.data,
            status: err.response?.status,
        });
        res.status(500).json({ success: false, msg: "LINE login failed" });
    }
}
async function handleLoginRequest(event, client) {
    const userId = event.source.userId;
    const existingUser = await User.findOne({ lineUserId: userId });
    if (existingUser) {
        await client.replyMessage(event.replyToken, {
            type: "text",
            text: "✅ You are already logged in, Boy!",
        });
        return;
    }
    await client.replyMessage(event.replyToken, {
        type: "flex",
        altText: "Your mom",
        contents: loginRequestFlex(),
    });
}

async function handleLogout(event, client) {
    const userId = event.source.userId;

    const user = await User.findOne({ lineUserId: userId });

    if (!user) {
        return replyText(client, event.replyToken, "⚠️ You're not logged in.");
    }

    user.lineUserId = ""; // or use null if you prefer
    await user.save();

    return replyText(client, event.replyToken, "👋 You have been logged out.");
}

module.exports = {
    lineCallback,
    handleLoginRequest,
    handleLogout,
};
