const express = require('express');
const router = express.Router();
const {
  checkBookings,
  createBooking
} = require('../controllers/bookingController');

router.post('/check', checkBookings);            
router.post('/create', createBooking);            

module.exports = router;
