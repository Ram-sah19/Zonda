const express = require("express");
const router = express.Router();
const {
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
} = require("../controller/adminController");

const authMiddleware = require("../middleware/authMiddleware");
const { adminMiddleware, superAdminMiddleware } = require("../middleware/adminMiddleware");

// All admin routes require authentication and general admin privilege
router.use(authMiddleware);
router.use(adminMiddleware);

// Dashboard metrics
router.get("/stats", getDashboardStats);

// User moderation
router.get("/users", getUsers);
router.put("/users/:id/suspend", updateUserSuspension);
router.put("/users/:id/role", superAdminMiddleware, updateAdminRole);

// Seller verification
router.put("/sellers/:id/status", updateSellerStatus);

// Delivery partner verification
router.put("/delivery-partners/:id/status", updateDeliveryPartnerStatus);

// Product management
router.get("/products", getProducts);
router.put("/products/:id", editProduct);
router.delete("/products/:id", deleteProduct);

// Category CRUD
router.get("/categories", getCategories);
router.post("/categories", addCategory);
router.delete("/categories/:id", deleteCategory);

// Order overrides
router.get("/orders", getOrders);
router.put("/orders/:id/status", updateOrderStatus);
router.put("/orders/:orderId/assign-manual", assignDeliveryManually);
router.put("/orders/:orderId/assign-auto", assignDeliveryAuto);

// Coupon code controls
router.get("/coupons", getCoupons);
router.post("/coupons", addCoupon);
router.delete("/coupons/:id", deleteCoupon);

// Audit trails (requires Super Admin privilege)
router.get("/logs", superAdminMiddleware, getActivityLogs);

module.exports = router;
