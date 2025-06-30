const express = require('express');
const router = express.Router();
const {
  checkBookings,
  createBooking,
  getCustomerBookings
} = require('../controllers/bookingController');
const { verifyCustomerToken } = require('../middlewares/customerAuth');

router.post('/check', checkBookings);            
router.post('/create', createBooking);            
router.get('/history', verifyCustomerToken, getCustomerBookings);

module.exports = router;