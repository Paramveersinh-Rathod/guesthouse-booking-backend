const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');
const auth = require('../controllers/authController');

router.post('/login', login);
router.post('/verify-otp', auth.verifyOtp);

module.exports = router;
