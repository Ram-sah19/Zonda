const Cart = require("../model/Cart");

// Static product database for validation
const PRODUCTS = {
  1: { name: "Samsung Galaxy S24 Ultra", price: 124999 },
  2: { name: "Nova 2 Neo 5G", price: 12999 },
  3: { name: "Lenovo Legion Pro 5", price: 144999 },
  4: { name: "Lenovo ThinkPad E14", price: 56999 },
  5: { name: "Mivi Soundbar 100W", price: 3999 },
  6: { name: "Buds Pro Gen 2", price: 999 },
  7: { name: "Ex Wireless ANC Earbuds", price: 1299 },
  8: { name: "Plex Smart Watch Active", price: 2499 },
  9: { name: "Sony Bravia 55\" 4K Smart TV", price: 57999 },
  10: { name: "PlayStation 5 Console Slim", price: 44990 },
  11: { name: "Dyson V15 Vacuum Cleaner", price: 65900 },
  12: { name: "Sony Alpha 7 IV Mirrorless", price: 218990 },
  13: { name: "Logitech MX Master 3S Mouse", price: 9495 },
  14: { name: "Zonda UltraWide 34\" Curved", price: 29999 }
};

// @desc    Retrieve the authenticated user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [] });
    }
    res.json(cart);
  } catch (error) {
    console.error("Get Cart Error:", error);
    res.status(500).json({ message: "Server error fetching cart", error: error.message });
  }
};

// @desc    Add a product to the cart
// @route   POST /api/cart/add
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const qty = parseInt(quantity, 10) || 1;

    const product = PRODUCTS[productId];
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex((item) => item.productId === parseInt(productId, 10));
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += qty;
    } else {
      cart.items.push({
        productId: parseInt(productId, 10),
        quantity: qty,
        price: product.price,
      });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error("Add to Cart Error:", error);
    res.status(500).json({ message: "Server error adding item to cart", error: error.message });
  }
};

// @desc    Update the quantity of a cart item
// @route   PATCH /api/cart/update
// @access  Private
const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const qty = parseInt(quantity, 10);

    if (isNaN(qty) || qty < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex((item) => item.productId === parseInt(productId, 10));
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = qty;
      await cart.save();
      res.json(cart);
    } else {
      res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.error("Update Cart Error:", error);
    res.status(500).json({ message: "Server error updating cart", error: error.message });
  }
};

// @desc    Remove a specific product from the cart
// @route   DELETE /api/cart/remove/:productId
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const initialLength = cart.items.length;
    cart.items = cart.items.filter((item) => item.productId !== parseInt(productId, 10));

    if (cart.items.length === initialLength) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error("Remove from Cart Error:", error);
    res.status(500).json({ message: "Server error removing item from cart", error: error.message });
  }
};

// @desc    Clear the entire cart
// @route   DELETE /api/cart/clear
// @access  Private
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error("Clear Cart Error:", error);
    res.status(500).json({ message: "Server error clearing cart", error: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
