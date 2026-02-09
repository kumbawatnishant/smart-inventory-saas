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

  async generateSeo(req, res) {
    try {
      const { id } = req.params;
      const result = await inventoryService.generateProductSeo(id);
      res.json({ success: true, data: result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async createProduct(req, res) {
    try {
      const id = await inventoryService.addProduct(req.body);
      res.status(201).json({ success: true, message: 'Product created', id });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async recordSale(req, res) {
    try {
      const { productId, quantity } = req.body;
      await inventoryService.recordSale(productId, quantity);
      res.json({ success: true, message: 'Sale recorded' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new AnalyticsController();