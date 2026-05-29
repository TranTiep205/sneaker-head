const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getOrders, createOrder } = require('../controllers/orderController');

// User phải đăng nhập mới xem và tạo order
router.get('/', protect, getOrders);
router.post('/', protect, createOrder);

module.exports = router;