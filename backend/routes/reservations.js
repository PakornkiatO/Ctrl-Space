const express = require('express');

const {protect, authorize} = require('../middleware/auth');
const {getReservations, getReservation, addReservation, updateReservation, deleteReservation} = require('../controllers/reservation');

const router = express.Router({mergeParams: true});

router.route('/').get(protect, getReservations).post(protect, authorize('admin', 'user'), addReservation);
router.route('/:id').get(protect, getReservation).put(protect, authorize('admin', 'user'), updateReservation).delete(protect, authorize('admin', 'user'), deleteReservation);

module.exports = router;