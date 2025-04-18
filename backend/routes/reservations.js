const express = require('express');

const {protect} = require('../middleware/auth');
const {getReservation} = require('../controllers/reservation');

const router = express.Router();

router.route('/').get(protect, getReservation);

module.exports = router;