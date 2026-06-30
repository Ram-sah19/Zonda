const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const deliveryMiddleware = require("../middleware/deliveryMiddleware");
const deliveryController = require("../controller/deliveryController");

// Available order requests for delivery partners
router.get("/requests", authMiddleware, deliveryMiddleware, deliveryController.getAvailableRequests);

// Accept a delivery request
router.post("/orders/:orderId/accept", authMiddleware, deliveryMiddleware, deliveryController.acceptDelivery);

// Update delivery routing milestone / location
router.put("/orders/:orderId/status", authMiddleware, deliveryMiddleware, deliveryController.updateDeliveryStatus);

// Fetch earnings summary and delivery logs
router.get("/earnings", authMiddleware, deliveryMiddleware, deliveryController.getPartnerEarnings);

module.exports = router;
