const express = require('express');
const router = express.Router();
const reservationRouter = require('./reservations');
const {protect, authorize} = require('../middleware/auth');
const {getCoworkings, getCoworking, createCoworking, updateCoworking, deleteCoworking} = require('../controllers/coworkings');

router.use('/:coworkingId/reservations', reservationRouter);

router.route('/').get(getCoworkings).post(protect, authorize('admin'), createCoworking);
router.route('/:id').get(getCoworking).put(protect, authorize('admin'), updateCoworking).delete(protect, authorize('admin'), deleteCoworking);

module.exports = router;