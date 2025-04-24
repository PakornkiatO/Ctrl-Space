const moment = require("moment-timezone");
const Reservation = require("../models/Reservation");
const User = require("../models/User");
const { client } = require("../utils/lineClient");
const cron = require("node-cron");

const TIMEZONE = "Asia/Bangkok"; // change this if you use a different timezone

async function notify(reservation) {
    try {
        const user = await User.findById(reservation.user);
        if (!user || !user.lineUserId) return;

        await client.pushMessage(user.lineUserId, {
            type: "text",
            text: `🔔 Reminder: Your reservation at ${reservation.coworking.name} is in 30 minutes!`,
        });
        reservation.notified = true;
        await reservation.save();
        console.log(`✅ Notification sent to ${user.lineUserId}`);
    } catch (err) {
        console.error("❌ Error notifying user:", err);
    }
}

async function startReservationScheduler() {
    cron.schedule("* * * * *", async () => {
        const now = moment().tz("Asia/Bangkok");
        const in30Minutes = now.clone().add(30, "minutes");
        console.log(
            "⏰ Cron job triggered at:",
            now.format("YYYY-MM-DD HH:mm:ss")
        );

        try {
            const reservations = await Reservation.find({
                startDateTime: {
                    $gte: now.toDate(),
                    $lte: in30Minutes.toDate(),
                },
                notified: false,
            }).populate("coworking");

            console.log(`Found ${reservations.length} reservations to check`);

            for (const reservation of reservations) {
                const startDateTime = moment(reservation.startTime).tz(
                    "Asia/Bangkok"
                );
                console.log(
                    `Start time (Bangkok) of reservation ${
                        reservation._id
                    }: ${startDateTime.format("YYYY-MM-DD HH:mm")}`
                );

                if (startDateTime.isBetween(now, in30Minutes)) {
                    console.log(
                        `✅ Reservation ${reservation._id} is within the 30-minute window`
                    );
                    await notify(reservation);
                } else {
                    console.log(
                        "❌ Reservation is not within the 30-minute window"
                    );
                }
            }
        } catch (err) {
            console.error("❌ Scheduler error:", err);
        }
    });
}
async function deleteReservationExpired() {
    const now = moment().tz("Asia/Bangkok"); // Get current time in Bangkok timezone
    console.log(
        "⏰ Deleting expired reservations at:",
        now.format("YYYY-MM-DD HH:mm:ss")
    );

    try {
        // Find reservations that have passed their end time and are not yet deleted
        const expiredReservations = await Reservation.find({
            endTime: {
                $lte: now.toDate(), // Find reservations whose end time is before now
            },
            status: { $ne: "canceled" }, // Ensure it's not already canceled
        });

        console.log(
            `Found ${expiredReservations.length} expired reservations to delete`
        );

        // Loop through the expired reservations and delete them
        for (const reservation of expiredReservations) {
            console.log(`❌ Deleting expired reservation ${reservation._id}`);
            reservation.status = "expired";
            // await reservation.remove(); // Remove the expired reservation
            console.log(`✅ Reservation ${reservation._id} has been deleted.`);
            continue;
        }
    } catch (err) {
        console.error("❌ Error deleting expired reservations:", err);
    }
}
module.exports = {
    startReservationScheduler,
    deleteReservationExpired,
};
