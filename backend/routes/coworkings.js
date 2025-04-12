const express = require('express');
const router = express.Router();
const {getCoworkings, getCoworking, createCoworking, updateCoworking, deleteCoworking} = require('../controllers/coworkings');

router.route('/').get(getCoworkings).post(createCoworking);
router.route('/:id').get(getCoworking).put(updateCoworking).delete(deleteCoworking);

module.exports = router;