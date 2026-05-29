const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");

async function getNextOrderId() {
  const latestOrder = await Order.findOne().sort({ id: -1 }).lean();
  const latestId = Number(latestOrder?.id);
  return Number.isFinite(latestId) ? latestId + 1 : 1001;
}

async function getOrders(req, res) {
    try {
        const user = req.user;
        const isAdmin = String(user?.role || '').toLowerCase() === 'admin';

        // ✅ Admin lấy tất cả, user thường chỉ lấy của mình
        const query = isAdmin ? {} : { userId: user._id };

        const orders = await Order.find(query)
            .sort({ createdAt: -1 })
            .populate('userId', 'name email');

        return res.json(orders);
    } catch (error) {
        console.error("Failed to load orders:", error);
        return res.status(500).json({ message: "Cannot read orders data" });
    }
}

async function createOrder(req, res) {
  try {
    const payload = req.body || {};
    const items = Array.isArray(payload.items) ? payload.items : [];

    if (items.length === 0) {
      return res.status(400).json({ message: "Order must contain at least 1 item" });
    }

    const insufficients = [];
    const resolvedItems = [];

    for (const item of items) {
      const qty = Math.max(1, Number(item.qty ?? item.quantity ?? 1));

      // ✅ FIX 1: Tìm product bằng _id (ObjectId) - frontend gửi lên _id string
      const product = await Product.findById(item.productId);

      if (!product) {
        insufficients.push({ productId: item.productId, reason: "Product not found" });
        continue;
      }

      if (Number(product.stock) < qty) {
        insufficients.push({
          productId: product._id,
          name: product.name,
          requestedQty: qty,
          availableStock: Number(product.stock),
          reason: "Not enough stock",
        });
        continue;
      }

      resolvedItems.push({ product, qty });
    }

    if (insufficients.length > 0) {
      return res.status(400).json({
        message: "Cannot create order because some items are out of stock",
        errors: insufficients,
      });
    }

    for (const { product, qty } of resolvedItems) {
      product.stock = Number(product.stock) - qty;
      await product.save();
    }

    const newOrder = await Order.create({
      // ✅ FIX 2: Lấy userId từ JWT token (req.user), không lấy từ payload frontend
      userId: req.user._id,
      id: await getNextOrderId(),
      items: resolvedItems.map(({ product, qty }) => ({
        // ✅ FIX 3: productId là Number (trường id tự đặt), không phải ObjectId
        productId: product.id ?? null,
        name: product.name,
        price: product.price,
        qty: qty,
        image: product.image || "",
      })),
      total: resolvedItems.reduce((sum, { product, qty }) => sum + product.price * qty, 0),
      customer: payload.customer || {},
      status: "pending",
      statusText: "Đang giao",
    });

    return res.status(201).json(newOrder);
  } catch (error) {
    console.error("createOrder error:", error);
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getOrders,
  createOrder,
};