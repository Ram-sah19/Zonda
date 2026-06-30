const express = require("express");
const router = express.Router();
const { createOrder, getMyOrders, getOrderById, submitDeliveryRating } = require("../controller/orderController");
const authMiddleware = require("../middleware/authMiddleware");

// All order routes are private and require user authentication
router.use(authMiddleware);

router.post("/", createOrder);
router.get("/", getMyOrders);
router.get("/:id", getOrderById);
router.put("/:id/delivery-rating", submitDeliveryRating);

module.exports = router;
