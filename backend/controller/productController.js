const Product = require("../model/Product");

// @desc    Get all products (with optional filtering by category or search term)
// @route   GET /api/products
// @access  Public
const getAllProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== "all") {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { desc: { $regex: search, $options: "i" } }
      ];
    }

    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    console.error("Get All Products Error:", error);
    res.status(500).json({ message: "Server error fetching products", error: error.message });
  }
};

// @desc    Get single product by custom id field
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const productId = parseInt(req.params.id, 10);
    const product = await Product.findOne({ id: productId });
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.json(product);
  } catch (error) {
    console.error("Get Product By ID Error:", error);
    res.status(500).json({ message: "Server error fetching product details", error: error.message });
  }
};

// @desc    Get all products created by the logged-in seller
// @route   GET /api/products/seller/me
// @access  Private (Seller only)
const getSellerProducts = async (req, res) => {
  try {
    // Verify user is a seller
    if (!req.user.isSeller) {
      return res.status(403).json({ message: "Access denied. Only sellers can view their dashboard." });
    }

    const products = await Product.find({ sellerId: req.user._id });
    res.json(products);
  } catch (error) {
    console.error("Get Seller Products Error:", error);
    res.status(500).json({ message: "Server error fetching seller products", error: error.message });
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private (Seller only)
const createProduct = async (req, res) => {
  try {
    if (!req.user.isSeller) {
      return res.status(403).json({ message: "Access denied. Only sellers can add products." });
    }

    const { name, category, desc, price, originalPrice, src, badge, stock } = req.body;

    if (!name || !category || !desc || !price || !src) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }

    // Dynamically calculate the next ID (max id + 1)
    const lastProduct = await Product.findOne().sort("-id");
    const nextId = lastProduct ? lastProduct.id + 1 : 1;

    const product = await Product.create({
      id: nextId,
      name,
      category,
      desc,
      price: Number(price),
      originalPrice: originalPrice || "",
      src,
      badge: badge || "",
      stock: stock ? Number(stock) : 10,
      sellerId: req.user._id
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).json({ message: "Server error creating product", error: error.message });
  }
};

// @desc    Update a seller product
// @route   PUT /api/products/:id
// @access  Private (Seller only)
const updateProduct = async (req, res) => {
  try {
    if (!req.user.isSeller) {
      return res.status(403).json({ message: "Access denied. Only sellers can edit products." });
    }

    const productId = parseInt(req.params.id, 10);
    const product = await Product.findOne({ id: productId });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Verify ownership
    if (product.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied. You can only manage your own products." });
    }

    const { name, category, desc, price, originalPrice, src, badge, stock } = req.body;

    product.name = name || product.name;
    product.category = category || product.category;
    product.desc = desc || product.desc;
    product.price = price !== undefined ? Number(price) : product.price;
    product.originalPrice = originalPrice !== undefined ? originalPrice : product.originalPrice;
    product.src = src || product.src;
    product.badge = badge !== undefined ? badge : product.badge;
    product.stock = stock !== undefined ? Number(stock) : product.stock;

    await product.save();
    res.json(product);
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({ message: "Server error updating product", error: error.message });
  }
};

// @desc    Delete a seller product
// @route   DELETE /api/products/:id
// @access  Private (Seller only)
const deleteProduct = async (req, res) => {
  try {
    if (!req.user.isSeller) {
      return res.status(403).json({ message: "Access denied. Only sellers can delete products." });
    }

    const productId = parseInt(req.params.id, 10);
    const product = await Product.findOne({ id: productId });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Verify ownership
    if (product.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied. You can only manage your own products." });
    }

    await Product.deleteOne({ id: productId });
    res.json({ message: "Product deleted successfully", id: productId });
  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({ message: "Server error deleting product", error: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  getSellerProducts,
  createProduct,
  updateProduct,
  deleteProduct
};
