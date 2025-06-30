const express = require('express');
const app = express();
require('dotenv').config();

app.use(express.json()); // For parsing JSON

// Test route
app.get('/', (req, res) => {
  res.send('Guest House Booking API is running ✅');
});
app.use('/uploads', express.static('uploads'));
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const roomRoutes = require('./routes/roomRoutes');
app.use('/api/rooms', roomRoutes);

const bookingRoutes = require('./routes/bookingRoutes');
app.use('/api/bookings', bookingRoutes);

const paymentRoutes = require('./routes/paymentRoutes');
app.use('/api/payments', paymentRoutes);

const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);

const reportRoutes = require('./routes/reportRoutes');
app.use('/api/reports', reportRoutes);

module.exports = app;
