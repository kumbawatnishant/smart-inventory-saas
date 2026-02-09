const inventoryService = require('../services/inventoryService');
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

class AnalyticsController {
  async getDashboardData(req, res) {
    try {
      const userId = req.auth.userId;
      const data = await inventoryService.getInventoryAnalytics(userId);
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
      const userId = req.auth.userId;
      const result = await inventoryService.generateProductSeo(id, userId);
      res.json({ success: true, data: result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async createProduct(req, res) {
    try {
      const userId = req.auth.userId;
      const id = await inventoryService.addProduct(req.body, userId);
      res.status(201).json({ success: true, message: 'Product created', id });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async recordSale(req, res) {
    try {
      const userId = req.auth.userId;
      const { productId, quantity } = req.body;
      await inventoryService.recordSale(productId, quantity, userId);
      res.json({ success: true, message: 'Sale recorded' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async createCheckoutSession(req, res) {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Smart Inventory Pro',
              },
              unit_amount: 2000, // $20.00
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${req.headers.origin}/?success=true`,
        cancel_url: `${req.headers.origin}/?canceled=true`,
      });

      res.json({ id: session.id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new AnalyticsController();