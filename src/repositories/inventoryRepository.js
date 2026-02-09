const db = require('../config/db');

class InventoryRepository {
  async getAllProducts(userId) {
    const [rows] = await db.query('SELECT * FROM products WHERE user_id = ?', [userId]);
    return rows;
  }

  async getSalesHistoryByProductId(productId, days = 30) {
    const [rows] = await db.query(
      `SELECT quantity_sold, sale_date 
       FROM sales_history 
       WHERE product_id = ? 
       AND sale_date >= date('now', '-' || ? || ' days')`,
      [productId, days]
    );
    return rows;
  }
  
  async updateProductSeo(productId, seoText) {
      await db.query('UPDATE products SET seo_description = ? WHERE id = ?', [seoText, productId]);
  }

  async createProduct(product, userId) {
    const { supplier_id, name, sku, description, price, current_stock, min_threshold } = product;
    const [result] = await db.query(
      `INSERT INTO products (supplier_id, name, sku, description, price, current_stock, min_threshold, user_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [supplier_id, name, sku, description, price, current_stock, min_threshold, userId]
    );
    return result.insertId;
  }

  async addSaleRecord(productId, quantity, userId) {
    await db.query(
      'INSERT INTO sales_history (product_id, quantity_sold, sale_date, user_id) VALUES (?, ?, date("now"), ?)',
      [productId, quantity, userId]
    );
  }

  async updateStock(productId, quantityChange) {
    await db.query(
      'UPDATE products SET current_stock = current_stock + ? WHERE id = ?',
      [quantityChange, productId]
    );
  }
}

module.exports = new InventoryRepository();