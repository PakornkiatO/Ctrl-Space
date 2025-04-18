const express = require('express');

const {protect} = require('../middleware/auth');
const {getReservations, addReservation} = require('../controllers/reservation');

const router = express.Router({mergeParams: true});

router.route('/').get(protect, getReservations).post(protect, addReservation);

module.exports = router;