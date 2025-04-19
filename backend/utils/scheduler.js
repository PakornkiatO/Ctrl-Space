const cron = require("node-cron");
const notifyUpcomingReservations = require("./service/notifyHandler/notifyUpcomingReservations");

cron.schedule("*/5 * * * *", async () => {
    console.log("🔄 Running reservation notification check...");
    await notifyUpcomingReservations();
});
