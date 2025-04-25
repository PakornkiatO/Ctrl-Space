const moment = require("moment");
const Reservation = require("../models/Reservation");
const User = require("../models/User");
const { client } = require("../utils/lineClient");
const cron = require("node-cron");

async function notify(reservation) {
    try {
        const user = await User.findById(reservation.user);
        if (!user || !user.lineUserId) return;

        await client.pushMessage(user.lineUserId, {
            type: "text",
            text: `🔔 Reminder: Your reservation at ${reservation.coworking.name} is in 30 minutes!`,
        });
        reservation.status = "pending";
        await reservation.save();
        console.log(`✅ Notification sent to ${user.lineUserId}`);
    } catch (err) {
        console.error("❌ Error notifying user:", err);
    }
}

async function startReservationScheduler() {
    cron.schedule("* * * * *", async () => {
        const now = moment(); // Use local timezone (no need for .tz)
        const in30Minutes = now.clone().add(30, "minutes");
        try {
            const reservations = await Reservation.find({
                startDateTime: {
                    $gte: now.toDate(),
                    $lte: in30Minutes.toDate(),
                },
                status: "active", // Ensure it's not already canceled
            }).populate("coworking");

            console.log(`Found ${reservations.length} reservations to check`);

            for (const reservation of reservations) {
                const startDateTime = moment(reservation.startTime); // No need to use .tz here
                console.log(
                    `Start time of reservation ${
                        reservation._id
                    }: ${startDateTime.format("YYYY-MM-DD HH:mm")}`
                );

                if (startDateTime.isBetween(now, in30Minutes)) {
                    console.log(
                        `✅ Reservation ${reservation._id} is within the 30-minute window`
                    );
                    await notify(reservation);
                }
            }
        } catch (err) {
            console.error("❌ Scheduler error:", err);
        }
    });
}

async function endReservationExpired() {
    cron.schedule("* * * * *", async () => {
        const now = moment(); // Use local timezone (no need for .tz)
        try {
            // Find reservations that have passed their end time and are not yet deleted
            const expiredReservations = await Reservation.find({
                endTime: {
                    $lte: now.toDate(), // Find reservations whose end time is before now
                },
                status: { $in: ["active", "pending"] }, // Ensure it's not already canceled
            });

            console.log(
                `Found ${expiredReservations.length} expired reservations`
            );

            // Loop through the expired reservations and delete them
            for (const reservation of expiredReservations) {
                console.log(
                    `❌ expired reservation ${reservation._id}, endtime: ${reservation.endTime}`
                );

                reservation.status = "expired";
                await reservation.save();
                // await reservation.remove(); // Remove the expired reservation
            }
        } catch (err) {
            console.error("❌ Error deleting expired reservations:", err);
        }
    });
}
async function deleteExpiredReservations() {
    cron.schedule("*/2 * * * *", async () => {
        const now = moment(); // Current time

        try {
            // Step 1: Find expired reservations not already marked as "action" or "complete"
            const expiredReservations = await Reservation.find({
                endTime: { $lte: now.toDate() },
                status: { $in: ["canceled", "expired"] },
            });

            // Step 2: If any found, delete them
            if (expiredReservations.length > 0) {
                await Reservation.deleteMany({
                    _id: { $in: expiredReservations.map((r) => r._id) },
                });

                // Step 3: Log deleted reservation info
                expiredReservations.forEach((r) => {
                    console.log(`🗑 Deleted expired reservation: ${r._id}`);
                });
            } else {
                console.log("✅ No expired reservations to delete.");
            }
        } catch (err) {
            console.error("❌ Error deleting expired reservations:", err);
        }
    });
}

module.exports = {
    startReservationScheduler,
    endReservationExpired,
    deleteExpiredReservations,
};
