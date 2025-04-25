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
        reservation.notified = true; // Mark as notified to avoid duplicate notifications
        await reservation.save();
        console.log(`✅ Notification sent to ${user.lineUserId}`);
    } catch (err) {
        console.error("❌ Error notifying user:", err);
    }
}

function buildStartDateTime(rsDate, timeStr) {
    const dateStr = moment(rsDate).format("YYYY-MM-DD");
    return moment.tz(
        `${dateStr} ${timeStr}`,
        "YYYY-MM-DD HH:mm",
        "Asia/Bangkok"
    );
}

async function startReservationScheduler() {
    cron.schedule("* * * * *", async () => {
        console.log("🔔 Checking for reservations to notify...");
        const now = moment.tz("Asia/Bangkok");
        const in30Minutes = now.clone().add(31, "minutes");

        try {
            const reservations = await Reservation.find({
                notified: false,
                status: "active",
            }).populate("coworking");

            for (const reservation of reservations) {
                const startDateTime = buildStartDateTime(
                    reservation.rsDate,
                    reservation.startTime
                );

                if (startDateTime.isBetween(now, in30Minutes)) {
                    console.log(
                        `🔔 Notifying for reservation ${reservation._id}`
                    );

                    // Call your LINE or custom notification logic
                    await notify(reservation);

                    // Mark as notified
                    reservation.notified = true;
                    await reservation.save();
                }
            }
        } catch (err) {
            console.error("❌ Scheduler error:", err.message);
        }
    });
}
async function endReservationExpired() {
    cron.schedule("* * * * *", async () => {
        const now = moment(); // Current time
        try {
            // Find reservations that have passed their end time and are still active
            const expiredReservations = await Reservation.find({
                status: "active",
                // notified: false, // Ensure it's not already notified
            }).populate("coworking");

            console.log(
                `Found ${expiredReservations.length} reservations to check for expiry.`
            );

            // Loop through the expired reservations and check if they have passed
            for (const reservation of expiredReservations) {
                const endTimeString = reservation.endTime; // Example: "13:00"
                const currentDate = now.format("YYYY-MM-DD"); // Current date

                // Combine date with endTime to form a full datetime
                const endDateTime = moment(
                    `${currentDate} ${endTimeString}`,
                    "YYYY-MM-DD HH:mm"
                );

                // Check if the reservation's end time has passed
                if (endDateTime.isBefore(now)) {
                    console.log(
                        `❌ Expired reservation ${
                            reservation._id
                        }, end time: ${endDateTime.format(
                            "YYYY-MM-DD HH:mm:ss"
                        )}`
                    );

                    // Mark as expired
                    reservation.status = "expired";
                    await reservation.save();
                    // console.log(reservation.coworking);
                    notifyExpiration(reservation); // Notify user about expiration
                }
            }
        } catch (err) {
            console.error("❌ Error checking expired reservations:", err);
        }
    });
}

async function notifyExpiration(reservation) {
    // Example of how to send notification using your LINE bot or any other system
    try {
        const user = await User.findById(reservation.user);
        if (user) {
            await client.pushMessage(user.lineUserId, {
                type: "text",
                text: `Your reservation at ${reservation.coworking.name} has expired.`,
            });
        }
    } catch (err) {
        console.error(
            "❌ Error notifying user about expired reservation:",
            err
        );
    }
}

async function deleteExpiredReservations() {
    cron.schedule("*/5 * * * *", async () => {
        const now = moment.tz("Asia/Bangkok"); // Use local timezone (Asia/Bangkok)

        try {
            // Step 1: Find expired reservations that have been canceled or expired
            const expiredReservations = await Reservation.find({
                endTime: { $lte: now.toDate() }, // Find reservations whose end time is before now
                status: { $in: ["canceled", "expired"] }, // Only expired or canceled reservations
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
