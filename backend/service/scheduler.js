const Reservation = require("../models/Reservation");
const User = require("../models/User");
const lineClient = require("../utils/lineClient"); // your configured LINE SDK client
const cron = require("node-cron");

async function notify(reservation) {
    try {
        const user = await User.findById(reservation.user);
        if (!user || !user.lineUserId) return;

        await lineClient.pushMessage(user.lineUserId, {
            type: "text",
            text: `🔔 Reminder: Your reservation at ${reservation.coworking.name} is in 30 minutes!`,
        });

        console.log(`✅ Notification sent to ${user.lineUserId}`);
    } catch (err) {
        console.error("❌ Error notifying user:", err);
    }
}

function startReservationScheduler() {
    cron.schedule("*/5 * * * *", async () => {
        const now = new Date();
        const in30Minutes = new Date(now.getTime() + 30 * 60 * 1000);

        try {
            const reservations = await Reservation.find({
                rsDate: {
                    $gte: now,
                    $lte: in30Minutes,
                },
            }).populate("coworking");
            for (const reservation of reservations) {
                await notify(reservation);
            }
        } catch (err) {
            console.error("❌ Scheduler error:", err);
        }
    });
}

module.exports = {
    startReservationScheduler,
};
