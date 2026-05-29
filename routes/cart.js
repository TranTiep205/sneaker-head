const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', cartController.getCart);
router.post('/add', cartController.addToCart);
router.delete('/:productId', cartController.removeFromCart);
router.delete('/', cartController.clearCart);

module.exports = router;