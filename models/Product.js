const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      default: "",
    },
    brand: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      default: "Unisex",
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    desc: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
