const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const report = require('../controllers/reportController');

// Revenue Report
router.get('/revenue', verifyToken, report.getRevenue);

// Frequent Customers
router.get('/frequent-customers', verifyToken, report.getFrequentCustomers);

// Room Occupancy (optional)
router.get('/room-occupancy', verifyToken, report.getRoomOccupancy);

module.exports = router;
