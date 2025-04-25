const express = require("express");
const router = express.Router();
const { webhook, verifyWebhook } = require("../controllers/line");
const { lineCallback } = require("../service/handlers/loginHand");

// LINE webhook POST
router.post("/webhook", webhook);

router.post("/", verifyWebhook);

router.get("/callback", lineCallback);

module.exports = router;
