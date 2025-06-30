const pool = require('../config/db');

// GET /api/rooms/types
exports.getRoomTypes = async (req, res) => {
  try {
    const [rooms] = await pool.query(`
      SELECT room_type, MIN(price_non_member) AS price 
      FROM room_prices 
      GROUP BY room_type
    `);
    res.json({ room_types: rooms });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/rooms/facilities
exports.getFacilities = async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT DISTINCT facilities FROM rooms`);
    const facilitiesSet = new Set();

    rows.forEach(row => {
      row.facilities?.split(',').forEach(f => facilitiesSet.add(f.trim()));
    });

    res.json({ facilities: [...facilitiesSet] });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/rooms/availability
exports.checkAvailability = async (req, res) => {
  const { from_date, to_date } = req.body;

  try {
    const [availableRooms] = await pool.query(`
      SELECT * FROM rooms
      WHERE id NOT IN (
        SELECT room_id FROM bookings 
        WHERE (
          (from_date <= ? AND to_date >= ?) OR
          (from_date <= ? AND to_date >= ?) OR
          (from_date >= ? AND to_date <= ?)
        )
      ) AND status = 'available'
    `, [from_date, from_date, to_date, to_date, from_date, to_date]);

    res.json({ available_rooms: availableRooms });
  } catch (err) {
    res.status(500).json({ message: 'Availability check failed' });
  }
};
