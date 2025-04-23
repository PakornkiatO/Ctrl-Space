const { Client } = require("@line/bot-sdk");

const client = new Client({
    channelAccessToken: process.env.LINEMESSAGE_CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.LINEMESSAGE_CHANNEL_SECRET,
});
// const state = crypto.randomUUID(); // or any random string generator

const lineCallbackUrl = `${process.env.MY_API}/line/callback`;
const loginUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${
    process.env.LINELOGIN_CHANNEL_ID
}&redirect_uri=${encodeURIComponent(
    lineCallbackUrl
)}&state=random123&scope=profile%20openid&bot_prompt=normal`;

function replyText(client, token, message) {
    return client.replyMessage(token, {
        type: "text",
        text: message,
    });
}
module.exports = {
    client,
    lineCallbackUrl,
    loginUrl,
    replyText,
};
