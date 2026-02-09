const inventoryRepo = require('../repositories/inventoryRepository');
const aiService = require('./aiService');

class InventoryService {
  async getInventoryAnalytics(userId) {
    const subscription = await inventoryRepo.getUserSubscription(userId);
    const isPro = Boolean(subscription.is_pro);
    const products = await inventoryRepo.getAllProducts(userId);
    
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
      if (isPro && product.current_stock <= product.min_threshold) {
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
        seo_description: product.seo_description,
        status: product.current_stock <= product.min_threshold ? 'CRITICAL' : 'OK',
        ai_insight: aiInsight
      };
    }));

    return { products: analyticsData, isPro };
  }

  async generateProductSeo(productId, userId) {
    const subscription = await inventoryRepo.getUserSubscription(userId);
    if (!subscription.is_pro) {
      throw new Error("Upgrade to Pro to use AI SEO features.");
    }

    const products = await inventoryRepo.getAllProducts(userId);
    const product = products.find(p => p.id == productId);
    
    if (!product) throw new Error("Product not found");

    const aiResult = await aiService.generateSeoDescription(product.name, product.description);
    await inventoryRepo.updateProductSeo(productId, aiResult.seo_text);
    
    return aiResult;
  }

  async addProduct(productData, userId) {
    // In a real app, you might validate SKU uniqueness here before calling repo
    return await inventoryRepo.createProduct(productData, userId);
  }

  async recordSale(productId, quantity, userId) {
    await inventoryRepo.addSaleRecord(productId, quantity, userId);
    await inventoryRepo.updateStock(productId, -quantity);
  }
}

module.exports = new InventoryService();