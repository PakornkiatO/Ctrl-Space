const { getCoworkingFlex } = require("./flexBuilder");
const axios = require("axios");
const { replyText } = require("../../utils/line");
const LIMIT = 4;
async function fetchCoworkings(page = 1) {
    const response = await axios.get(`${process.env.MY_API}/coworkings`, {
        params: { page, limit: LIMIT, sort: "province,district,address" },
    });

    const coworkings = response.data.data || [];
    // console.log("all", response.data);

    const total = response.data.count || 0;
    const totalPages = Math.ceil(total / LIMIT);

    return { coworkings, totalPages };
}

async function handleCoworkingsMsg(event, client, page = 1) {
    try {
        const { coworkings, totalPages } = await fetchCoworkings(page);

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
async function handleCoworkingsPostback(event, client, data) {
    const page = parseInt(data.get("page")) || 1;
    return handleCoworkingsMsg(event, client, page);
}
module.exports = {
    handleCoworkingsMsg,
    handleCoworkingsPostback,
};
