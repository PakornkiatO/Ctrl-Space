const express = require('express');
const router = express.Router();
const {protect} = require('../middleware/auth');
const {getCoworkings, getCoworking, createCoworking, updateCoworking, deleteCoworking} = require('../controllers/coworkings');

router.route('/').get(getCoworkings).post(protect, createCoworking);
router.route('/:id').get(getCoworking).put(protect, updateCoworking).delete(protect, deleteCoworking);

module.exports = router;