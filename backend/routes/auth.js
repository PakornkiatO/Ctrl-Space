const express = require('express')

const {register, login, getMe, logout} = require('../controllers/auth');
const {protect} = require('../middleware/auth');

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/me').get(protect, getMe);
router.route('/logout').get(logout);

module.exports = router;