const pool = require('../config/db');
const bcrypt = require('bcryptjs');

// POST /api/admin/rooms/create
exports.createRoom = async (req, res) => {
  const { room_type, room_number, facilities } = req.body;

  try {
    const [existing] = await pool.query(
      'SELECT * FROM rooms WHERE room_number = ?',
      [room_number]
    );
    if (existing.length > 0)
      return res.status(400).json({ message: 'Room number already exists' });

    await pool.query(
      'INSERT INTO rooms (room_type, room_number, facilities, status) VALUES (?, ?, ?, "available")',
      [room_type, room_number, facilities]
    );

    res.status(201).json({ message: 'Room created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create room' });
  }
};


// PUT /api/admin/rooms/update/:id
exports.updateRoom = async (req, res) => {
  const { id } = req.params;
  const { room_type, room_number, facilities, status } = req.body;

  try {
    await pool.query(
      'UPDATE rooms SET room_type = ?, room_number = ?, facilities = ?, status = ? WHERE id = ?',
      [room_type, room_number, facilities, status, id]
    );

    res.json({ message: 'Room updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update room' });
  }
};


// DELETE /api/admin/rooms/delete/:id
exports.deleteRoom = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM rooms WHERE id = ?', [id]);
    res.json({ message: 'Room deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete room' });
  }
};


// POST /api/admin/rooms/set-price
exports.setRoomPrice = async (req, res) => {
  const { room_type, date_from, date_to, price_member, price_non_member } = req.body;

  try {
    await pool.query(`
      INSERT INTO room_prices (room_type, date_from, date_to, price_member, price_non_member)
      VALUES (?, ?, ?, ?, ?)
    `, [room_type, date_from, date_to, price_member, price_non_member]);

    res.status(201).json({ message: 'Room price set successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to set room price' });
  }
};

// POST /api/admin/rooms/upload-image
exports.uploadRoomImage = async (req, res) => {
  const { room_id } = req.body;
  const image_url = req.file?.path;

  if (!room_id || !image_url) {
    return res.status(400).json({ message: 'Room ID and image file are required' });
  }

  try {
    await pool.query(
      'INSERT INTO room_photos (room_id, image_url) VALUES (?, ?)',
      [room_id, image_url]
    );
    res.status(201).json({ message: 'Image uploaded successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to upload image' });
  }
};

exports.createWalkInBooking = async (req, res) => {
  const {
    name,
    phone,
    email,
    room_id,
    from_date,
    to_date,
    is_member,
    membership_number,
    id_proof_url,
    payment_mode
  } = req.body;

  try {
    // Step 1: Insert or find user by phone/email
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE phone = ? OR email = ?',
      [phone, email]
    );

    let userId;
    if (existing.length > 0) {
      userId = existing[0].id;
    } else {
      const [newUser] = await pool.query(
        'INSERT INTO users (name, phone, email, user_type) VALUES (?, ?, ?, "customer")',
        [name, phone, email]
      );
      userId = newUser.insertId;
    }

    // Step 2: Create booking with status completed (walk-in = instant payment)
    const [booking] = await pool.query(
      `INSERT INTO bookings
        (user_id, room_id, from_date, to_date, is_member, membership_number, id_proof_url, payment_status, payment_mode)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'completed', ?)`,
      [userId, room_id, from_date, to_date, is_member, membership_number, id_proof_url, payment_mode]
    );

    res.status(201).json({
      message: 'Walk-in booking successful',
      booking_id: booking.insertId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Walk-in booking failed' });
  }
};

exports.getCustomerHistory = async (req, res) => {
  try {
    const [bookings] = await pool.query(`
      SELECT 
        b.id AS booking_id,
        u.name AS customer_name,
        u.phone,
        r.room_number,
        r.room_type,
        b.from_date,
        b.to_date,
        b.is_member,
        b.membership_number,
        b.payment_status,
        b.payment_mode,
        b.created_at
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN rooms r ON b.room_id = r.id
      ORDER BY b.created_at DESC
    `);

    res.json({ bookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch booking history' });
  }
};

exports.createStaffUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO users (name, email, password_hash, user_type) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role || 'staff']
    );

    res.status(201).json({ message: 'Staff user created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create staff user' });
  }
};

exports.listStaffUsers = async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, name, email, user_type FROM users WHERE user_type = "staff"'
    );
    res.json({ staff: users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch staff list' });
  }
};
