const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db.js");

dotenv.config({ path: "./config/config.env" });

(async () => {
    try {
        await connectDB();

        const {
            startReservationScheduler,
            deleteReservationExpired,
        } = require("./service/scheduler.js");
        startReservationScheduler();
        deleteReservationExpired();
        const app = express();

        app.use(express.json());
        app.use(cookieParser());

        app.use("/api/v1/coworkings", require("./routes/coworkings.js"));
        app.use("/api/v1/auth", require("./routes/auth.js"));
        app.use("/api/v1/reservations", require("./routes/reservations.js"));
        app.use("/api/v1/line", require("./routes/line.js"));

        const PORT = process.env.PORT || 5000;
        const server = app.listen(PORT, () => {
            console.log(
                "✅ Server running in",
                process.env.NODE_ENV,
                "on port",
                PORT
            );
        });

        process.on("unhandledRejection", (err, promise) => {
            console.error(`❌ Error: ${err.message}`);
            server.close(() => process.exit(1));
        });
    } catch (err) {
        console.error("❌ Failed to start server:", err);
        process.exit(1);
    }
})();
