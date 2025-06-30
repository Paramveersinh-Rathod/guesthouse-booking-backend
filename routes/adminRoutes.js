const express = require('express');
const router = express.Router();
const admin = require('../controllers/adminController');
const { verifyToken } = require('../middlewares/authMiddleware');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // You can customize this later

// Room Management
router.post('/rooms/create', verifyToken, admin.createRoom);
router.put('/rooms/update/:id', verifyToken, admin.updateRoom);
router.delete('/rooms/delete/:id', verifyToken, admin.deleteRoom);
router.post('/rooms/set-price', verifyToken, admin.setRoomPrice);
router.post('/rooms/upload-image',verifyToken,upload.single('image'),admin.uploadRoomImage);
router.post('/bookings/create-walkin',verifyToken,admin.createWalkInBooking);
router.get('/customers/history', verifyToken, admin.getCustomerHistory);
router.post('/users/create-staff', verifyToken, admin.createStaffUser);
router.get('/users/list', verifyToken, admin.listStaffUsers);

module.exports = router;
