const express = require("express");
const router = express.Router();
const { webhook, verifyWebhook } = require("../controllers/line");

// LINE webhook POST
router.post("/webhook", webhook);

router.post("/", verifyWebhook);

module.exports = router;
