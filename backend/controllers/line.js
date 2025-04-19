const { messageHandlers, postbackHandlers } = require("../service/mainHand");
const lineClient = require("../utils/lineClient");
const User = require("../models/User");

// Verify webhook setup
exports.verifyWebhook = (req, res) => {
    res.status(200).send("Webhook verified successfully!");
};

exports.webhook = (req, res) => {
    Promise.all(req.body.events.map((event) => handleEvent(event, lineClient)))
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
    const userId = event.source.userId;
    let user = await User.findOne({ lineUserId: userId });
    // if (!user) {
    //     // If user does not exist
    //     user = new User({
    //         name: `User ${userId}`, // You can assign a default name, or get it from LINE's profile API
    //         lineUserId: userId, // Store LINE's userId
    //     });
    //     await user.save();
    //     console.log(`New user created with LINE ID: ${userId}`);
    // } else {
    //     // If user already exists
    //     if (!user.lineUserId) {
    //         user.lineUserId = userId;
    //         await user.save();
    //         console.log(`Existing user updated with LINE ID: ${userId}`);
    //     }
    // }
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
