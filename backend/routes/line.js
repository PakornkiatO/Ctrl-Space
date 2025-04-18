const express = require("express");

const { webhook } = require("../controllers/line");

const router = express.Router();

// router.route("/push").post(sendLineMessage);
router.route("/").post(webhook);

module.exports = router;
