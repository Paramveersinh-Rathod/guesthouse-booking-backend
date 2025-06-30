const pool = require('../config/db');
const bcrypt = require('bcryptjs');

exports.getRevenue = async (req, res) => {
  const { from, to } = req.query;

  try {
    const [result] = await pool.query(`
      SELECT SUM(p.amount) AS total_revenue
      FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      WHERE p.status = 'success'
      AND b.from_date >= ? AND b.to_date <= ?
    `, [from, to]);

    res.json({ total_revenue: result[0].total_revenue || 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch revenue' });
  }
};

exports.getFrequentCustomers = async (req, res) => {
  try {
    const [customers] = await pool.query(`
      SELECT u.name, u.phone, COUNT(b.id) AS booking_count
      FROM users u
      JOIN bookings b ON u.id = b.user_id
      GROUP BY u.id
      ORDER BY booking_count DESC
      LIMIT 10
    `);

    res.json({ frequent_customers: customers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch frequent customers' });
  }
};


exports.getRoomOccupancy = async (req, res) => {
  try {
    const [data] = await pool.query(`
      SELECT r.room_number, COUNT(b.id) AS total_bookings
      FROM rooms r
      LEFT JOIN bookings b ON r.id = b.room_id
      GROUP BY r.id
      ORDER BY total_bookings DESC
    `);

    res.json({ room_occupancy: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch room occupancy' });
  }
};
