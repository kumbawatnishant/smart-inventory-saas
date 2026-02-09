const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

// Singleton to hold the connection
let dbPromise = null;

function getDb() {
  if (!dbPromise) {
    dbPromise = open({
      filename: path.join(__dirname, '../../inventory.sqlite'),
      driver: sqlite3.Database
    });
  }
  return dbPromise;
}

module.exports = {
  query: async (sql, params) => {
    const db = await getDb();
    // Wrapper to mimic mysql2: returns [rows] for SELECT, [result] for others
    if (sql.trim().toUpperCase().startsWith('SELECT')) {
      const rows = await db.all(sql, params);
      return [rows]; 
    }
    const result = await db.run(sql, params);
    // Normalize SQLite result to match mysql2 structure
    result.insertId = result.lastID;
    return [result];
  }
};