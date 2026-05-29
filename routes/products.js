const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');

// Public routes
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

// Protected routes - Chỉ Admin mới được dùng
router.post('/', protect, adminOnly, productController.createProduct);
router.put('/:id', protect, adminOnly, productController.updateProduct);
router.delete('/:id', protect, adminOnly, productController.deleteProduct);

module.exports = router;