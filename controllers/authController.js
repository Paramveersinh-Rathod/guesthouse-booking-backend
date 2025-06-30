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

