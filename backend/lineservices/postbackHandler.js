async function handleview(event, client) {
    const userId = event.source.userId;

    await client.pushMessage(userId, {
        type: "text",
        text: "🔍 Here's what you're viewing.",
    });
}

module.exports = {
    handleview,
    // more handlers later like `handleBuy`, etc.
};
