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
}

module.exports = new AuthController();