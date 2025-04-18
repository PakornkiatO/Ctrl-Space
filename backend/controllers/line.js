const line = require("@line/bot-sdk");

// LINE config
const config = {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET, // If required, otherwise can be omitted
};

// Create LINE client
const client = new line.Client(config);

exports.sendLineMessage = async (req, res) => {
    try {
        const userId = "Uadecebc013cf4f4bb1798e411c5edf2b"; // <- Replace with actual userId
        const profile = await client.getProfile(userId);
        console.log(profile);
        const message = {
            type: "text",
            text: "Hello from my server! 👋",
        };

        await client.pushMessage(userId, message);

        res.status(200).json({ success: true, msg: "Message sent!" });
    } catch (err) {
        console.error("Error sending message:", err);
        res.status(500).json({ success: false, msg: "Failed to send message" });
    }
};

// Webhook handler
exports.webhook = (req, res) => {
    Promise.all(req.body.events.map(handleEvent))
        .then((result) => res.json(result)) // Respond with 200 OK to LINE platform
        .catch((err) => {
            console.error("Error processing events:", err);
            res.status(500).json({
                success: false,
                msg: "Error processing events",
            });
        });
};

// Handle the events
async function handleEvent(event) {
    if (event.type !== "message" || event.message.type !== "text") {
        return Promise.resolve(null);
    }

    const userMessage = event.message.text;
    const replyToken = event.replyToken;
    const userId = event.source.userId; // <-- Get user ID

    // Respond with a message (echo the user's message)
    const echo = {
        type: "text",
        text: `You said: ${userMessage}`,
    };

    try {
        // Send a reply to the user
        await client.replyMessage(replyToken, echo);
    } catch (err) {
        console.error("Error sending reply:", err);
    }
}
