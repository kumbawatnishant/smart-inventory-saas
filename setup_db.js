const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function setup() {
  try {
    const dbPath = path.join(__dirname, 'inventory.sqlite');
    
    // Open SQLite database
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    console.log('🔌 Connected to SQLite...');

    // Read and execute schema.sql
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('⚙️  Running schema...');
    await db.exec(schemaSql);
    console.log('✅ Database schema applied.');

    // Check if products already exist
    const result = await db.get('SELECT count(*) as count FROM products');
    if (result.count > 0) {
      console.log('ℹ️  Data already exists. Skipping seed.');
      return;
    }

    console.log('🌱 Seeding sample data...');

    // 1. Insert Default User (admin / password) - ID will be 1
    const hashedPassword = await bcrypt.hash('password', 10);
    await db.run(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      ['admin', hashedPassword]
    );

    // 2. Insert Suppliers (Linked to Admin ID 1)
    await db.run(`
      INSERT INTO suppliers (name, contact_email, lead_time_days, user_id) VALUES 
      ('TechGlobal', 'supply@techglobal.com', 5, 1),
      ('ElectroWorld', 'orders@electroworld.com', 12, 1);
    `);

    // 3. Insert Products (Linked to Admin ID 1)
    // We create a mix of Healthy and Critical items
    await db.run(`
      INSERT INTO products (supplier_id, name, sku, description, price, current_stock, min_threshold, user_id) VALUES 
      (1, 'Wireless Ergonomic Mouse', 'MS-ERGO-01', 'Vertical mouse for wrist health', 29.99, 5, 10, 1),
      (1, 'Mechanical Keyboard', 'KB-MECH-02', 'RGB Backlit Blue Switch', 89.99, 45, 15, 1),
      (2, '4K Monitor 27"', 'MN-4K-27', 'IPS Panel 144Hz', 350.00, 8, 5, 1);
    `);

    // 4. Insert Sales History
    // We need to generate enough sales history to calculate "Days Remaining"
    // For the Mouse (Stock 5, Threshold 10), let's simulate high demand (2/day) -> ~2.5 days left -> CRITICAL
    
    const salesValues = [];
    const today = new Date();
    
    // Generate 30 days of sales
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      // Product 1 (Mouse): High demand (2-4 units/day)
      salesValues.push(`(1, ${Math.floor(Math.random() * 3) + 2}, '${dateStr}', 1)`);
      
      // Product 2 (Keyboard): Moderate demand (0-2 units/day)
      salesValues.push(`(2, ${Math.floor(Math.random() * 3)}, '${dateStr}', 1)`);

      // Product 3 (Monitor): Low demand (0-1 units/day)
      salesValues.push(`(3, ${Math.floor(Math.random() * 2)}, '${dateStr}', 1)`);
    }

    const salesSql = `INSERT INTO sales_history (product_id, quantity_sold, sale_date, user_id) VALUES ${salesValues.join(',')}`;
    await db.run(salesSql);

    console.log('✅ Seed data inserted successfully!');

  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

if (require.main === module) {
  setup();
}

module.exports = setup;