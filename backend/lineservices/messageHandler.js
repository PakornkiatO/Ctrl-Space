async function handleProfile(userId, client) {
    try {
        const profile = await client.getProfile(userId);
        const flexMsg = {
            type: "flex",
            altText: "Your Profile",
            contents: {
                type: "bubble",
                hero: {
                    type: "image",
                    url: profile.pictureUrl,
                    size: "full",
                    aspectRatio: "1:1",
                    aspectMode: "cover",
                },
                body: {
                    type: "box",
                    layout: "vertical",
                    contents: [
                        {
                            type: "text",
                            text: `Hello, ${profile.displayName}!`,
                            weight: "bold",
                            size: "xl",
                        },
                        {
                            type: "text",
                            text: profile.statusMessage || "No status message.",
                            size: "sm",
                            color: "#888888",
                            margin: "md",
                        },
                    ],
                },
            },
        };

        await client.pushMessage(userId, flexMsg);
    } catch (err) {
        console.error("Error sending profile flex message:", err);
    }
}

async function handleMenu(replyToken, client) {
    const menuTemplate = {
        type: "template",
        altText: "This is a buttons template",
        template: {
            type: "buttons",
            title: "Menu",
            text: "Please select",
            actions: [
                {
                    type: "postback",
                    label: "Buy",
                    data: "action=buy&itemid=123",
                },
                {
                    type: "message",
                    label: "Say hi",
                    text: "Hi!",
                },
            ],
        },
    };

    return client.replyMessage(replyToken, menuTemplate);
}
async function notifyUserReservationApproaching(userId, reservation) {
    const message = {
        type: "text",
        text: `🔔 Reminder: Your reservation at ${reservation.coworking.name} is starting at ${reservation.startTime}.`,
    };

    try {
        await client.pushMessage(userId, message);
        console.log("Notification sent to:", userId);
    } catch (err) {
        console.error("Failed to send notification:", err);
    }
}
// ✅ export both
module.exports = {
    notifyUserReservationApproaching,
    handleProfile,
    handleMenu,
};
