const { getCoworkingFlex } = require("./flexBuilder");
const axios = require("axios");
const { replyText, replyFlex } = require("../../utils/lineClient");
async function handleGetCoworkings(event, client, page = 1) {
    const limit = 5;
    const skip = (page - 1) * limit;
    try {
        // Replace with your API endpoint to fetch coworking spaces
        const response = await axios.get(`${process.env.MY_API}/coworkings`, {
            params: {
                skip: skip,
                limit: limit,
            },
        });

        const coworkings = response.data.data; // Assuming the API returns a list of coworking spaces
        const total = response.data.count; // Assuming the API provides total count of coworking spaces
        const totalPages = Math.ceil(total / limit);

        if (!coworkings.length) {
            return replyText(
                client,
                event.replyToken,
                "😔 No coworking spaces found."
            );
        }

        const flexMessage = getCoworkingFlex(coworkings, page, totalPages);
        return client.replyMessage(event.replyToken, flexMessage);
    } catch (error) {
        console.error("Error fetching coworking spaces:", error);
        return replyText(
            client,
            event.replyToken,
            "😔 Failed to fetch coworking spaces."
        );
    }
}
module.exports = {
    handleGetCoworkings,
};
