const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const clerkAuth = require('../middleware/clerkAuth');

router.use(clerkAuth); // Protect all routes below

router.get('/analytics', analyticsController.getDashboardData);
router.post('/products/:id/seo', analyticsController.generateSeo);
router.post('/products', analyticsController.createProduct);
router.post('/sales', analyticsController.recordSale);
router.post('/create-checkout-session', analyticsController.createCheckoutSession);

module.exports = router;