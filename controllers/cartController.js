const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

async function getCart(req, res) {
    try {
        const userId = req.user.id;
        console.log("📋 GET CART - User:", userId);

        const cart = await Cart.find({ user: userId })
            .populate('product', 'name price image');

        console.log("📦 Số item trong giỏ:", cart.length);
        console.log("Chi tiết giỏ:", JSON.stringify(cart, null, 2));

        res.json({ success: true, cart });
    } catch (error) {
        console.error("getCart error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

async function addToCart(req, res) {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user.id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm" });
    }

    let cartItem = await Cart.findOne({ user: userId, product: productId });

    if (cartItem) {
      cartItem.quantity += Number(quantity);
      await cartItem.save();
    } else {
      cartItem = await Cart.create({
        user: userId,
        product: productId,
        quantity: Number(quantity)
      });
    }

    res.json({ success: true, message: "Đã thêm vào giỏ" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function removeFromCart(req, res) {
    try {
        const { productId } = req.params;
        const userId = req.user.id;

        console.log("🔍 REMOVE - User:", userId, "ProductId:", productId);

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ success: false, message: "productId không hợp lệ" });
        }

        const result = await Cart.findOneAndDelete({ 
            user: userId, 
            product: new mongoose.Types.ObjectId(productId)   // ← Fix quan trọng
        });

        if (!result) {
            console.log("❌ Không tìm thấy item trong giỏ");
            return res.status(404).json({ 
                success: false, 
                message: "Không tìm thấy sản phẩm trong giỏ" 
            });
        }

        console.log("✅ Đã xóa thành công");
        res.json({ success: true, message: "Đã xóa khỏi giỏ hàng" });
    } catch (error) {
        console.error("removeFromCart error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

async function clearCart(req, res) {
  try {
    await Cart.deleteMany({ user: req.user.id });
    res.json({ success: true, message: "Đã xóa toàn bộ giỏ hàng" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  clearCart
};
