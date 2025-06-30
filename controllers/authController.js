const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(401).json({ message: 'User not found' });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, user_type: user.user_type },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, user: { id: user.id, name: user.name, user_type: user.user_type } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ message: 'Phone and OTP are required' });
  }

  // Fake OTP check for demo purposes
  if (otp !== '123456') {
    return res.status(401).json({ message: 'Invalid OTP' });
  }

  try {
    const [users] = await pool.query(
      'SELECT * FROM users WHERE phone = ? AND user_type = "customer"',
      [phone]
    );

    let user;
    if (users.length === 0) {
      const [insert] = await pool.query(
        'INSERT INTO users (name, phone, user_type) VALUES (?, ?, "customer")',
        [`Guest-${phone.slice(-4)}`, phone]
      );
      user = { id: insert.insertId, phone };
    } else {
      user = users[0];
    }

    const token = jwt.sign(
      { id: user.id, phone: user.phone, role: 'customer' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to verify OTP' });
  }
};
