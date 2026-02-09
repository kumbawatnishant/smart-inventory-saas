const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.use(authenticateToken); // Protect all routes below

router.get('/analytics', analyticsController.getDashboardData);
router.post('/products/:id/seo', analyticsController.generateSeo);
router.post('/products', analyticsController.createProduct);
router.post('/sales', analyticsController.recordSale);

module.exports = router;