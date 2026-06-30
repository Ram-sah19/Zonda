const Order = require("../model/Order");
const Cart = require("../model/Cart");

// @desc    Create a new order and clear user's cart
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentDetails, pricing } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items provided for order" });
    }

    if (!shippingAddress) {
      return res.status(400).json({ message: "Shipping address is required" });
    }

    if (!pricing) {
      return res.status(400).json({ message: "Pricing details are required" });
    }

    // Create the order in the database
    const order = new Order({
      userId: req.user._id,
      items,
      shippingAddress,
      paymentDetails,
      pricing,
    });

    const savedOrder = await order.save();

    // Clear the user's cart in the database
    const cart = await Cart.findOne({ userId: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.status(201).json({ success: true, order: savedOrder });
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ message: "Server error creating order", error: error.message });
  }
};

// @desc    Get logged-in user's orders
// @route   GET /api/orders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Get My Orders Error:", error);
    res.status(500).json({ message: "Server error fetching orders", error: error.message });
  }
};

// @desc    Get order details by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Ensure the order belongs to the logged-in user
    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Get Order By ID Error:", error);
    res.status(500).json({ message: "Server error fetching order details", error: error.message });
  }
};

const submitDeliveryRating = async (req, res) => {
  try {
    const { rating, feedback } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to rate this delivery" });
    }

    order.deliveryRating = rating;
    order.deliveryFeedback = feedback || "";
    await order.save();

    // Recalculate average ratings for the delivery partner
    if (order.deliveryPartnerId) {
      const User = require("../model/userSchema");
      const partner = await User.findById(order.deliveryPartnerId);
      if (partner) {
        const ratedOrders = await Order.find({ 
          deliveryPartnerId: order.deliveryPartnerId, 
          deliveryRating: { $gt: 0 } 
        });
        const totalRatingSum = ratedOrders.reduce((sum, curr) => sum + curr.deliveryRating, 0);
        
        partner.deliveryPartnerDetails = {
          ...partner.deliveryPartnerDetails,
          rating: {
            average: ratedOrders.length > 0 ? (totalRatingSum / ratedOrders.length) : 0,
            count: ratedOrders.length
          }
        };
        await partner.save();
      }
    }

    res.status(200).json({ success: true, message: "Rating recorded successfully", order });
  } catch (error) {
    console.error("Submit Delivery Rating Error:", error);
    res.status(500).json({ message: "Server error logging delivery rating", error: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  submitDeliveryRating,
};
