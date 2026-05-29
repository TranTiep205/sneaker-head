const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
    productId: { 
        type: Number,      // ✅ Number vì Product.id là số (1, 2, 3...)
        required: true 
    },
    name: { type: String, required: true },
    qty: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, default: "" },
}, { _id: false });

const orderSchema = new mongoose.Schema({
    id: {
        type: Number,      // ✅ auto-increment order id (1001, 1002...)
        unique: true,
        sparse: true       // ✅ tránh lỗi E11000 duplicate null
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId,  // ✅ ObjectId vì User dùng _id MongoDB
        ref: 'User',
        required: true
    },
    items: {
        type: [orderItemSchema],
        required: true,
        validate: {
            validator: (val) => Array.isArray(val) && val.length > 0,
            message: "Order must contain at least 1 item"
        }
    },
    total: {
        type: Number,
        required: true,
        min: 0
    },
    customer: {
        name: { type: String, default: '' },
        phone: { type: String, default: '' },
        address: { type: String, default: '' },
    },
    status: {
        type: String,
        default: "pending"
    },
    statusText: {
        type: String,
        default: "Đang giao"
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model("Order", orderSchema);