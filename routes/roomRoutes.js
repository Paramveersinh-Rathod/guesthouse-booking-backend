const express = require('express');
const router = express.Router();
const {
  getRoomTypes,
  getFacilities,
  checkAvailability
} = require('../controllers/roomController');

router.get('/types', getRoomTypes);
router.get('/facilities', getFacilities);
router.post('/availability', checkAvailability);

module.exports = router;
