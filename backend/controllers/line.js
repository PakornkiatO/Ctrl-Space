const line = require("@line/bot-sdk");
const {
    messageHandlers,
    postbackHandlers,
} = require("../lineservices/functionHandler");
// LINE config
const config = {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET, // If required, otherwise can be omitted
};
const client = new line.Client(config);

exports.webhook = (req, res) => {
    Promise.all(req.body.events.map((event) => handleEvent(event, client)))
        .then((result) => res.json(result))
        .catch((err) => {
            console.error("Webhook error:", err);
            res.status(500).json({ error: "Error processing events" });
        });
};

async function handleEvent(event, client) {
    if (event.type === "postback") {
        return postbackHandlers(event, client);
    }
    if (event.type === "message") {
        return messageHandlers(event, client);
    }

    return Promise.resolve(null);
}
