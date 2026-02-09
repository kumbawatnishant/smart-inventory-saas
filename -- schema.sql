// src/config/db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
// src/repositories/inventoryRepository.js
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
       AND sale_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)`,
      [productId, days]
    );
    return rows;
  }
  
  async updateProductSeo(productId, seoText) {
      await db.query('UPDATE products SET seo_description = ? WHERE id = ?', [seoText, productId]);
  }
}

module.exports = new InventoryRepository();
// src/services/aiService.js
const Groq = require('groq-sdk');
require('dotenv').config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

class AIService {
  /**
   * Generates a stock strategy based on current metrics.
   */
  async generateStockStrategy(productName, currentStock, dailyRunRate) {
    const prompt = `
      Analyze inventory for: ${productName}.
      Current Stock: .
      Avg Daily Sales: ${dailyRunRate.toFixed(2)}.
      
      Return a JSON object ONLY with these keys:
      - "status": "Healthy", "Critical", or "Overstocked"
      - "recommendation": A short strategic action (max 15 words).
      - "reorder_urgency": 1-10 scale.
    `;

    try {
      const completion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: "You are an inventory AI expert. Output valid JSON only." },
          { role: "user", content: prompt }
        ],
        model: "mixtral-8x7b-32768",
        response_format: { type: "json_object" } 
      });

      return JSON.parse(completion.choices[0].message.content);
    } catch (error) {
      console.error("AI Service Error:", error);
      return { status: "Unknown", recommendation: "AI Unavailable", reorder_urgency: 0 };
    }
  }
}

module.exports = new AIService();
// src/services/inventoryService.js
const inventoryRepo = require('../repositories/inventoryRepository');
const aiService = require('./aiService');

class InventoryService {
  async getInventoryAnalytics() {
    const products = await inventoryRepo.getAllProducts();
    
    // Process each product to calculate metrics
    const analyticsData = await Promise.all(products.map(async (product) => {
      const sales = await inventoryRepo.getSalesHistoryByProductId(product.id, 30);
      
      // Calculate Average Daily Sales (ADS)
      const totalSold = sales.reduce((sum, record) => sum + record.quantity_sold, 0);
      const ads = totalSold / 30; // Simple 30-day average
      
      // Calculate Days Remaining
      // Avoid division by zero
      const daysRemaining = ads > 0 ? Math.floor(product.current_stock / ads) : 999;

      // If stock is critical, fetch AI insights (Optimization: Only call AI for critical items)
      let aiInsight = null;
      if (product.current_stock <= product.min_threshold) {
         aiInsight = await aiService.generateStockStrategy(product.name, product.current_stock, ads);
      }

      return {
        id: product.id,
        name: product.name,
        sku: product.sku,
        stock: product.current_stock,
        threshold: product.min_threshold,
        ads: ads.toFixed(2),
        days_remaining: daysRemaining,
        status: product.current_stock <= product.min_threshold ? 'CRITICAL' : 'OK',
        ai_insight: aiInsight
      };
    }));

    return analyticsData;
  }
}

module.exports = new InventoryService();
// src/services/inventoryService.js
const inventoryRepo = require('../repositories/inventoryRepository');
const aiService = require('./aiService');

class InventoryService {
  async getInventoryAnalytics() {
    const products = await inventoryRepo.getAllProducts();
    
    // Process each product to calculate metrics
    const analyticsData = await Promise.all(products.map(async (product) => {
      const sales = await inventoryRepo.getSalesHistoryByProductId(product.id, 30);
      
      // Calculate Average Daily Sales (ADS)
      const totalSold = sales.reduce((sum, record) => sum + record.quantity_sold, 0);
      const ads = totalSold / 30; // Simple 30-day average
      
      // Calculate Days Remaining
      // Avoid division by zero
      const daysRemaining = ads > 0 ? Math.floor(product.current_stock / ads) : 999;

      // If stock is critical, fetch AI insights (Optimization: Only call AI for critical items)
      let aiInsight = null;
      if (product.current_stock <= product.min_threshold) {
         aiInsight = await aiService.generateStockStrategy(product.name, product.current_stock, ads);
      }

      return {
        id: product.id,
        name: product.name,
        sku: product.sku,
        stock: product.current_stock,
        threshold: product.min_threshold,
        ads: ads.toFixed(2),
        days_remaining: daysRemaining,
        status: product.current_stock <= product.min_threshold ? 'CRITICAL' : 'OK',
        ai_insight: aiInsight
      };
    }));

    return analyticsData;
  }
}

module.exports = new InventoryService();
// src/controllers/analyticsController.js
const inventoryService = require('../services/inventoryService');

class AnalyticsController {
  async getDashboardData(req, res) {
    try {
      const data = await inventoryService.getInventoryAnalytics();
      res.json({
        success: true,
        timestamp: new Date(),
        data: data
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  }
}

module.exports = new AnalyticsController();
// src/routes/analyticsRoutes.js
const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

router.get('/analytics', analyticsController.getDashboardData);

module.exports = router;
-- schema.sql

CREATE DATABASE IF NOT EXISTS smart_inventory_db;
USE smart_inventory_db;

-- 1. Suppliers Table
CREATE TABLE IF NOT EXISTS suppliers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255),
    lead_time_days INT DEFAULT 7, -- Average time to restock
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Products Table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_id INT,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    current_stock INT NOT NULL DEFAULT 0,
    min_threshold INT NOT NULL DEFAULT 10, -- Point at which we reorder
    seo_description TEXT, -- Field to store AI generated content
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL
);

-- 3. Sales History Table (Time-series data for demand forecasting)
CREATE TABLE IF NOT EXISTS sales_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    quantity_sold INT NOT NULL,
    sale_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX (product_id),
    INDEX (sale_date)
);
