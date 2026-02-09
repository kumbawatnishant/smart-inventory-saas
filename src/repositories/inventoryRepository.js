const db = require('../config/db');

class InventoryRepository {
  async getAllProducts() {
    const [rows] = await db.query('SELECT * FROM products');
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

  async createProduct(product) {
    const { supplier_id, name, sku, description, price, current_stock, min_threshold } = product;
    const [result] = await db.query(
      `INSERT INTO products (supplier_id, name, sku, description, price, current_stock, min_threshold)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [supplier_id, name, sku, description, price, current_stock, min_threshold]
    );
    return result.insertId;
  }

  async addSaleRecord(productId, quantity) {
    await db.query(
      'INSERT INTO sales_history (product_id, quantity_sold, sale_date) VALUES (?, ?, date("now"))',
      [productId, quantity]
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