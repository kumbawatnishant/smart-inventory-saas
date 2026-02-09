const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  try {
    const db = await open({
      filename: path.join(__dirname, 'inventory.sqlite'),
      driver: sqlite3.Database
    });

    const hashedPassword = await bcrypt.hash('password', 10);
    
    // Check if admin exists
    const existing = await db.get('SELECT * FROM users WHERE username = ?', ['admin']);
    
    if (existing) {
      console.log('User "admin" already exists. Updating password...');
      await db.run('UPDATE users SET password = ? WHERE username = ?', [hashedPassword, 'admin']);
    } else {
      console.log('Creating user "admin"...');
      await db.run('INSERT INTO users (username, password) VALUES (?, ?)', ['admin', hashedPassword]);
    }

    console.log('✅ Admin user ready: username="admin", password="password"');
  } catch (error) {
    console.error('Error creating admin:', error);
  }
}

createAdmin();