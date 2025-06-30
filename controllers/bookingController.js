const pool = require('../config/db');

// 📌 POST /api/bookings/create
exports.createBooking = async (req, res) => {
  const {
    user_id,
    room_id,
    from_date,
    to_date,
    is_member,
    membership_number,
    id_proof_url,
    payment_mode
  } = req.body;

  try {
    const [room] = await pool.query('SELECT * FROM rooms WHERE id = ?', [room_id]);
    if (room.length === 0) return res.status(404).json({ message: 'Room not found' });

    const [result] = await pool.query(`
      INSERT INTO bookings 
      (user_id, room_id, from_date, to_date, is_member, membership_number, id_proof_url, payment_status, payment_mode) 
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?)
    `, [user_id, room_id, from_date, to_date, is_member, membership_number, id_proof_url, payment_mode]);

    res.status(201).json({ message: 'Booking created', booking_id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Booking failed' });
  }
};

// 📌 POST /api/bookings/check
exports.checkBookings = async (req, res) => {
  const { phone } = req.body;

  try {
    const [users] = await pool.query('SELECT id FROM users WHERE phone = ?', [phone]);
    if (users.length === 0) return res.status(404).json({ message: 'User not found' });

    const userId = users[0].id;
    const [bookings] = await pool.query(
      'SELECT * FROM bookings WHERE user_id = ?', [userId]
    );

    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// 📌 POST /api/payments/initiate
exports.initiatePayment = async (req, res) => {
  const { booking_id, amount, mode } = req.body;

  try {
    const [result] = await pool.query(`
      INSERT INTO payments (booking_id, amount, mode, status, transaction_id)
      VALUES (?, ?, ?, 'pending', UUID())
    `, [booking_id, amount, mode]);

    res.status(201).json({ message: 'Payment initiated', payment_id: result.insertId });
  } catch (err) {
    console.error('❌ Error during payment initiation:', err); // Add this
    res.status(500).json({ message: 'Payment initiation failed' });
  }
};

// 📌 POST /api/payments/verify
exports.verifyPayment = async (req, res) => {
  const { booking_id, status } = req.body;

  try {
    await pool.query(
      'UPDATE payments SET status = ? WHERE booking_id = ?',
      [status, booking_id]
    );

    await pool.query(
      'UPDATE bookings SET payment_status = ? WHERE id = ?',
      [status === 'success' ? 'completed' : 'failed', booking_id]
    );

    res.json({ message: 'Payment status updated' });
  } catch (err) {
    res.status(500).json({ message: 'Payment verification failed' });
  }
};
