const User = require("../model/userSchema");
const Product = require("../model/Product");
const Order = require("../model/Order");
const AdminLog = require("../model/AdminLog");
const Category = require("../model/Category");
const Coupon = require("../model/Coupon");

// Helper function to log administrative actions
const logAdminAction = async (admin, action, details, req) => {
  try {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";
    await AdminLog.create({
      adminId: admin._id,
      adminName: admin.name,
      action,
      details,
      ipAddress: ip,
    });
  } catch (error) {
    console.error("Failed to log admin action:", error.message);
  }
};

// @desc    Get dashboard metrics and statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBuyers = await User.countDocuments({ isSeller: false, isAdmin: false });
    const totalSellers = await User.countDocuments({ isSeller: true });
    const totalAdmins = await User.countDocuments({ isAdmin: true });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const pendingSellers = await User.countDocuments({ isSeller: true, sellerStatus: "Pending" });

    // Calculate total revenue and commission (mocked based on orders)
    const orders = await Order.find();
    let totalSales = 0;
    orders.forEach((order) => {
      // Clean order amount string/number
      const amt = Number(order.totalAmount) || 0;
      totalSales += amt;
    });

    // Assume a 10% platform commission on sales
    const totalCommission = totalSales * 0.1;

    res.json({
      metrics: {
        totalUsers,
        totalBuyers,
        totalSellers,
        totalAdmins,
        totalProducts,
        totalOrders,
        pendingSellers,
        totalSales,
        totalCommission,
      },
    });
  } catch (error) {
    console.error("Get Stats Error:", error);
    res.status(500).json({ message: "Server error fetching stats", error: error.message });
  }
};

// @desc    Get all users (buyers, sellers, admins)
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error("Get Users Error:", error);
    res.status(500).json({ message: "Server error fetching users" });
  }
};

// @desc    Toggle suspension on a user account
// @route   PUT /api/admin/users/:id/suspend
// @access  Private/Admin
const updateUserSuspension = async (req, res) => {
  try {
    const { id } = req.params;
    const { isSuspended } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isAdmin && user.adminRole === "Super Admin" && req.user.adminRole !== "Super Admin") {
      return res.status(403).json({ message: "Only Super Admins can suspend other Super Admins" });
    }

    user.isSuspended = isSuspended;
    await user.save();

    await logAdminAction(
      req.user,
      isSuspended ? "Suspend Account" : "Unsuspend Account",
      `Changed suspension status of user: ${user.email} to ${isSuspended}`,
      req
    );

    res.json({ message: `User status updated successfully`, user });
  } catch (error) {
    console.error("Update User Status Error:", error);
    res.status(500).json({ message: "Server error updating user status" });
  }
};

// @desc    Change admin roles (Super Admin only)
// @route   PUT /api/admin/users/:id/role
// @access  Private/SuperAdmin
const updateAdminRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["Super Admin", "Manager", "Moderator", "Support"].includes(role)) {
      return res.status(400).json({ message: "Invalid administrator role specified" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isAdmin) {
      return res.status(400).json({ message: "Selected user is not an administrator" });
    }

    const oldRole = user.adminRole;
    user.adminRole = role;
    await user.save();

    await logAdminAction(
      req.user,
      "Update Admin Role",
      `Promoted/Demoted admin: ${user.email} from ${oldRole} to ${role}`,
      req
    );

    res.json({ message: `Admin role updated successfully`, user });
  } catch (error) {
    console.error("Update Admin Role Error:", error);
    res.status(500).json({ message: "Server error updating admin role" });
  }
};

// @desc    Review and update merchant seller status
// @route   PUT /api/admin/sellers/:id/status
// @access  Private/Admin
const updateSellerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Pending, Approved, Suspended

    if (!["Pending", "Approved", "Suspended", "None"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const user = await User.findById(id);
    if (!user || !user.isSeller) {
      return res.status(404).json({ message: "Seller account not found" });
    }

    const oldStatus = user.sellerStatus;
    user.sellerStatus = status;
    await user.save();

    await logAdminAction(
      req.user,
      "Moderate Seller",
      `Updated seller status of: ${user.email} from ${oldStatus} to ${status}`,
      req
    );

    res.json({ message: `Seller status successfully updated to ${status}`, user });
  } catch (error) {
    console.error("Update Seller Status Error:", error);
    res.status(500).json({ message: "Server error updating seller status" });
  }
};

// @desc    Fetch products list for moderation
// @route   GET /api/admin/products
// @access  Private/Admin
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("sellerId", "name email");
    res.json(products);
  } catch (error) {
    console.error("Admin Get Products Error:", error);
    res.status(500).json({ message: "Server error fetching products" });
  }
};

// @desc    Edit a product details
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, desc, price, originalPrice, stock, badge } = req.body;

    const product = await Product.findOne({ id: Number(id) });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.name = name || product.name;
    product.category = category || product.category;
    product.desc = desc || product.desc;
    product.price = price !== undefined ? price : product.price;
    product.originalPrice = originalPrice !== undefined ? originalPrice : product.originalPrice;
    product.stock = stock !== undefined ? stock : product.stock;
    product.badge = badge !== undefined ? badge : product.badge;

    await product.save();

    await logAdminAction(
      req.user,
      "Edit Product",
      `Updated details of product ID: ${id} (${product.name})`,
      req
    );

    res.json({ message: "Product updated successfully", product });
  } catch (error) {
    console.error("Admin Edit Product Error:", error);
    res.status(500).json({ message: "Server error editing product" });
  }
};

// @desc    Delete a product from catalog
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOneAndDelete({ id: Number(id) });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await logAdminAction(
      req.user,
      "Delete Product",
      `Removed product ID: ${id} (${product.name}) from marketplace`,
      req
    );

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Admin Delete Product Error:", error);
    res.status(500).json({ message: "Server error deleting product" });
  }
};

// @desc    Get all categories
// @route   GET /api/admin/categories
// @access  Private/Admin
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error("Get Categories Error:", error);
    res.status(500).json({ message: "Server error fetching categories" });
  }
};

// @desc    Add a category
// @route   POST /api/admin/categories
// @access  Private/Admin
const addCategory = async (req, res) => {
  try {
    const { name, subcategories } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const exists = await Category.findOne({ slug });
    if (exists) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await Category.create({
      name,
      slug,
      subcategories: subcategories || [],
    });

    await logAdminAction(
      req.user,
      "Create Category",
      `Created new product category: ${name}`,
      req
    );

    res.status(201).json(category);
  } catch (error) {
    console.error("Add Category Error:", error);
    res.status(500).json({ message: "Server error creating category" });
  }
};

// @desc    Delete a category
// @route   DELETE /api/admin/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await logAdminAction(
      req.user,
      "Delete Category",
      `Deleted product category: ${category.name}`,
      req
    );

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Delete Category Error:", error);
    res.status(500).json({ message: "Server error deleting category" });
  }
};

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("userId", "name email");
    res.json(orders);
  } catch (error) {
    console.error("Get Orders Error:", error);
    res.status(500).json({ message: "Server error fetching orders" });
  }
};

// @desc    Moderate/Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const oldStatus = order.orderStatus;
    order.orderStatus = orderStatus;
    await order.save();

    await logAdminAction(
      req.user,
      "Update Order Status",
      `Updated order: ${id} status from ${oldStatus} to ${orderStatus}`,
      req
    );

    res.json({ message: "Order status updated successfully", order });
  } catch (error) {
    console.error("Update Order Error:", error);
    res.status(500).json({ message: "Server error updating order" });
  }
};

// @desc    Get all promotional coupons
// @route   GET /api/admin/coupons
// @access  Private/Admin
const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (error) {
    console.error("Get Coupons Error:", error);
    res.status(500).json({ message: "Server error fetching coupons" });
  }
};

// @desc    Create a promotional coupon
// @route   POST /api/admin/coupons
// @access  Private/Admin
const addCoupon = async (req, res) => {
  try {
    const { code, discountType, discountValue, expiryDate } = req.body;

    if (!code || !discountValue || !expiryDate) {
      return res.status(400).json({ message: "Please provide all required coupon fields" });
    }

    const exists = await Coupon.findOne({ code: code.toUpperCase() });
    if (exists) {
      return res.status(400).json({ message: "Coupon code already exists" });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discountType,
      discountValue,
      expiryDate,
    });

    await logAdminAction(
      req.user,
      "Create Coupon",
      `Created discount coupon: ${coupon.code} (${discountValue} ${discountType === "percentage" ? "%" : "fixed"})`,
      req
    );

    res.status(201).json(coupon);
  } catch (error) {
    console.error("Add Coupon Error:", error);
    res.status(500).json({ message: "Server error creating coupon" });
  }
};

// @desc    Delete a coupon
// @route   DELETE /api/admin/coupons/:id
// @access  Private/Admin
const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByIdAndDelete(id);

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    await logAdminAction(
      req.user,
      "Delete Coupon",
      `Removed discount coupon: ${coupon.code}`,
      req
    );

    res.json({ message: "Coupon deleted successfully" });
  } catch (error) {
    console.error("Delete Coupon Error:", error);
    res.status(500).json({ message: "Server error deleting coupon" });
  }
};

// @desc    Get activity logs (Super Admin only)
// @route   GET /api/admin/logs
// @access  Private/SuperAdmin
const getActivityLogs = async (req, res) => {
  try {
    const logs = await AdminLog.find().sort({ createdAt: -1 }).limit(100);
    res.json(logs);
  } catch (error) {
    console.error("Get Logs Error:", error);
    res.status(500).json({ message: "Server error fetching activity logs" });
  }
};

// @desc    Update delivery partner approval status
// @route   PUT /api/admin/delivery-partners/:id/status
// @access  Private/Admin
const updateDeliveryPartnerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Pending, Approved, Suspended, None

    if (!["Pending", "Approved", "Suspended", "None"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const user = await User.findById(id);
    if (!user || !user.isDeliveryPartner) {
      return res.status(404).json({ message: "Delivery partner account not found" });
    }

    const oldStatus = user.deliveryPartnerStatus;
    user.deliveryPartnerStatus = status;
    await user.save();

    await logAdminAction(
      req.user,
      "Moderate Delivery Partner",
      `Updated delivery partner status of: ${user.email} from ${oldStatus} to ${status}`,
      req
    );

    res.json({ message: `Delivery partner status updated to ${status}`, user });
  } catch (error) {
    console.error("Update Delivery Partner Status Error:", error);
    res.status(500).json({ message: "Server error updating status" });
  }
};

// @desc    Manually assign order to delivery partner
// @route   PUT /api/admin/orders/:orderId/assign-manual
// @access  Private/Admin
const assignDeliveryManually = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { deliveryPartnerId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const partner = await User.findById(deliveryPartnerId);
    if (!partner || !partner.isDeliveryPartner) {
      return res.status(400).json({ message: "Selected user is not registered as a delivery partner" });
    }

    if (partner.deliveryPartnerStatus !== "Approved") {
      return res.status(400).json({ message: "Delivery partner registration is not approved yet" });
    }

    order.deliveryPartnerId = deliveryPartnerId;
    order.deliveryStatus = "Assigned";
    order.deliveryTimeline.push({
      status: "Assigned",
      description: `Order manually assigned to delivery partner: ${partner.name}`,
      timestamp: new Date()
    });

    await order.save();

    await logAdminAction(
      req.user,
      "Assign Delivery Manually",
      `Manually assigned order ${orderId} to partner ${partner.email}`,
      req
    );

    res.json({ message: `Delivery partner ${partner.name} assigned successfully`, order });
  } catch (error) {
    console.error("Manual Assignment Error:", error);
    res.status(500).json({ message: "Server error in manual assignment" });
  }
};

// @desc    Auto-assign order to closest online delivery partner
// @route   PUT /api/admin/orders/:orderId/assign-auto
// @access  Private/Admin
const assignDeliveryAuto = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const orderLat = order.deliveryLiveLocation?.lat || 12.9716;
    const orderLng = order.deliveryLiveLocation?.lng || 77.5946;

    // Find available approved partners
    const partners = await User.find({
      isDeliveryPartner: true,
      deliveryPartnerStatus: "Approved",
      "deliveryPartnerDetails.isAvailable": true
    });

    if (partners.length === 0) {
      return res.status(400).json({ message: "No available delivery partners are currently online" });
    }

    // Sort by distance
    const partnersWithDistance = partners.map(p => {
      const pLat = p.deliveryPartnerDetails?.location?.lat || 12.9716;
      const pLng = p.deliveryPartnerDetails?.location?.lng || 77.5946;
      const distance = Math.sqrt(Math.pow(pLat - orderLat, 2) + Math.pow(pLng - orderLng, 2));
      return { partner: p, distance };
    });

    partnersWithDistance.sort((a, b) => a.distance - b.distance);
    const closestPartner = partnersWithDistance[0].partner;

    order.deliveryPartnerId = closestPartner._id;
    order.deliveryStatus = "Assigned";
    order.deliveryTimeline.push({
      status: "Assigned",
      description: `Automatically assigned to nearest partner: ${closestPartner.name} (Simulated distance: ${(partnersWithDistance[0].distance * 111).toFixed(2)} km)`,
      timestamp: new Date()
    });

    await order.save();

    await logAdminAction(
      req.user,
      "Assign Delivery Auto",
      `Automatically assigned order ${orderId} to nearest partner ${closestPartner.email}`,
      req
    );

    res.json({ message: `Order auto-assigned to ${closestPartner.name}`, order });
  } catch (error) {
    console.error("Auto Assignment Error:", error);
    res.status(500).json({ message: "Server error in auto assignment" });
  }
};

module.exports = {
  getDashboardStats,
  getUsers,
  updateUserSuspension,
  updateAdminRole,
  updateSellerStatus,
  getProducts,
  editProduct,
  deleteProduct,
  getCategories,
  addCategory,
  deleteCategory,
  getOrders,
  updateOrderStatus,
  getCoupons,
  addCoupon,
  deleteCoupon,
  getActivityLogs,
  updateDeliveryPartnerStatus,
  assignDeliveryManually,
  assignDeliveryAuto,
};
