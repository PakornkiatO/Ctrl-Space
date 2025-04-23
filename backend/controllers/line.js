const { postbackHandlers } = require("../service/postbackHand");
const { messageHandlers } = require("../service/messageHand");
const { client } = require("../utils/lineClient");

// Verify webhook setup
exports.verifyWebhook = (req, res) => {
    res.status(200).send("Webhook verified successfully!");
};

exports.webhook = (req, res) => {
    Promise.all(req.body.events.map((event) => handleEvent(event, client))) // Process each event in parallel
        .then((result) => {
            res.json(result); // Respond with the result after processing all events
        })
        .catch((err) => {
            console.error("Webhook error:", err); // Log any errors that occur
            res.status(500).json({ error: "Error processing events" }); // Return error response
        });
};

// Handle the event based on its type (message, postback, etc.)
async function handleEvent(event, client) {
    if (event.type === "message") {
        console.log(`Received message event: ${event.message.text}`);
        await messageHandlers(event, client); // Handle message event
    } else if (event.type === "postback") {
        console.log(`Received postback event: ${event.postback.data}`);
        await postbackHandlers(event, client); // Handle postback event
    } else {
        console.log(`Unknown event type: ${event.type}`);
    }
}
