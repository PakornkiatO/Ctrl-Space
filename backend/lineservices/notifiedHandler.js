// /service/notifyHandler/notifyUpcomingReservations.js
const Reservation = require("../models/Reservation");
const line = require("@line/bot-sdk");
const config = {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET, // If required, otherwise can be omitted
};
const client = new line.Client(config);

module.exports = async function notifyUpcomingReservations() {
    const now = new Date();
    const upcomingTime = new Date(now.getTime() + 30 * 60000); // 30 minutes ahead

    const reservations = await Reservation.find({
        startTime: { $gte: now, $lte: upcomingTime },
        notified: { $ne: true },
    }).populate("user"); // make sure user has userId for LINE

    for (let reservation of reservations) {
        if (reservation.user?.lineUserId) {
            await client.pushMessage(reservation.user.lineUserId, {
                type: "text",
                text: `🔔 Reminder: Your reservation at ${reservation.coworkingName} is starting soon!`,
            });

            // optional: mark as notified
            reservation.notified = true;
            await reservation.save();
        }
    }
};
