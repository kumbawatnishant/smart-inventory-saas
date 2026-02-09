const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'your_super_secret_key_change_in_production';

class AuthController {
  async login(req, res) {
    try {
      const { username, password } = req.body;

      // Fetch user
      const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
      const user = users[0];

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      // Generate Token
      const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '24h' });
      res.json({ success: true, token });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async register(req, res) {
    try {
      const { username, password } = req.body;

      // Check if user exists
      const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
      if (users.length > 0) {
        return res.status(400).json({ success: false, message: 'Username already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);

      // Generate Token
      const token = jwt.sign({ id: result.insertId, username }, SECRET_KEY, { expiresIn: '24h' });
      res.status(201).json({ success: true, token });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new AuthController();