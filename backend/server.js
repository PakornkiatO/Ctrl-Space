const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db.js");
const line = require("@line/bot-sdk");

dotenv.config({ path: "./config/config.env" });

connectDB();
const { startReservationScheduler } = require("./service/line/scheduler.js");
startReservationScheduler();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/coworkings", require("./routes/coworkings.js"));
app.use("/api/v1/auth", require("./routes/auth.js"));
app.use("/api/v1/reservations", require("./routes/reservations.js"));
app.use("/api/v1/line", require("./routes/line.js"));

const PORT = process.env.PORT;
const server = app.listen(
    PORT,
    console.log("Server running in ", process.env.NODE_ENV, " on port ", PORT)
);

process.on("unhandleRejection", (err, promise) => {
    console.log(`Error: ${err.message}`);

    server.close(() => process.exit(1));
});
