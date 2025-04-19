const express = require("express");

const { webhook } = require("../controllers/line");

const router = express.Router();
const config = {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET,
};
const line = require("@line/bot-sdk");
const client = new line.Client(config);
// router.route("/push").post(sendLineMessage);
router.route("/").post(webhook);

module.exports = router;
