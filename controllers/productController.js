const Product = require("../models/Product");

async function nextProductId() {
  const latestProduct = await Product.findOne().sort({ id: -1 }).lean();
  const latestId = Number(latestProduct?.id);
  return Number.isFinite(latestId) ? latestId + 1 : 1;
}

async function getProducts(req, res) {
  try {
    const products = await Product.find().sort({ id: 1 }).lean();
    return res.json(products);
  } catch (error) {
    console.error("Failed to load products:", error);
    return res.status(500).json({ message: "Cannot load products" });
  }
}

async function getProductById(req, res) {
  try {
    const product = await Product.findOne({ id: Number(req.params.id) }).lean();

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json(product);
  } catch (error) {
    console.error("Failed to load product by id:", error);
    return res.status(500).json({ message: "Cannot load product" });
  }
}

async function createProduct(req, res) {
  try {
    const payload = req.body || {};
    const newId = payload.id ?? (await nextProductId());

    const createdProduct = await Product.create({
      ...payload,
      id: Number(newId),
    });

    return res.status(201).json(createdProduct);
  } catch (error) {
    console.error("Failed to create product:", error);
    return res.status(500).json({ message: "Cannot create product" });
  }
}

async function updateProduct(req, res) {
  try {
    const existingProduct = await Product.findOne({ id: Number(req.params.id) });
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    Object.assign(existingProduct, req.body || {});
    existingProduct.id = Number(req.params.id);
    await existingProduct.save();

    return res.json(existingProduct);
  } catch (error) {
    console.error("Failed to update product:", error);
    return res.status(500).json({ message: "Cannot update product" });
  }
}

async function deleteProduct(req, res) {
  try {
    const deletedProduct = await Product.findOneAndDelete({ id: Number(req.params.id) }).lean();
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json({ message: "Product deleted", product: deletedProduct });
  } catch (error) {
    console.error("Failed to delete product:", error);
    return res.status(500).json({ message: "Cannot delete product" });
  }
}

module.exports = {
  getProducts,
  getProductById,   // export đúng tên
  createProduct,
  updateProduct,
  deleteProduct,
};
