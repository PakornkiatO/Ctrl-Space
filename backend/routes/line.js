const express = require("express");

const { sendLineMessage, webhook } = require("../controllers/line");

const router = express.Router();

router.route("/push").post(sendLineMessage);
// router.route("/test").get(test);
router.route("/webhook").post(webhook);
// router.route("/login").post(login);

module.exports = router;
