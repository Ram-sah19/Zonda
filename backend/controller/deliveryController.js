const Order = require("../model/Order");
const User = require("../model/userSchema");

// Fetch available orders for delivery partners
exports.getAvailableRequests = async (req, res) => {
  try {
    // Return all unassigned orders OR orders assigned specifically to this partner
    const orders = await Order.find({
      $or: [
        { deliveryStatus: "Unassigned" },
        { deliveryPartnerId: req.user._id, deliveryStatus: { $in: ["Assigned", "Accepted", "Picked Up", "Out for Delivery"] } }
      ]
    }).populate("userId", "name email");

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching delivery requests", error: error.message });
  }
};

// Accept a delivery request
exports.acceptDelivery = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.deliveryPartnerId && order.deliveryPartnerId.toString() !== req.user._id.toString() && order.deliveryStatus !== "Unassigned") {
      return res.status(400).json({ message: "Order already assigned to another delivery partner" });
    }

    order.deliveryPartnerId = req.user._id;
    order.deliveryStatus = "Accepted";
    order.orderStatus = "Shipped"; // Transition main order status
    order.deliveryEta = "30-45 mins";
    order.deliveryTimeline.push({
      status: "Accepted",
      description: `Delivery request accepted by partner: ${req.user.name}`,
    });

    await order.save();
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error accepting delivery", error: error.message });
  }
};

// Update delivery routing milestone and coordinate simulations
exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { status, remarks, lat, lng } = req.body;
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!order.deliveryPartnerId || order.deliveryPartnerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not authorized for this order dispatch" });
    }

    order.deliveryStatus = status;

    let desc = remarks || `Status transitioned to ${status}`;
    let baseCoordinates = { lat: 12.9716, lng: 77.5946 }; // Default center (e.g. Bengaluru)

    // Simulate coordinates based on delivery steps
    if (status === "Picked Up") {
      desc = "Package picked up from seller location. On the way to hub.";
      baseCoordinates = { lat: 12.9780, lng: 77.5990 };
      order.deliveryEta = "20-30 mins";
    } else if (status === "Out for Delivery") {
      desc = "Package is out for delivery with partner.";
      baseCoordinates = { lat: 12.9860, lng: 77.6080 };
      order.deliveryEta = "10 mins";
    } else if (status === "Delivered") {
      desc = "Order delivered successfully to shipping address.";
      baseCoordinates = { lat: 12.9940, lng: 77.6170 }; // Destination reached
      order.orderStatus = "Delivered";
      order.paymentDetails.paymentStatus = "Paid"; // Mark payment completed
      order.deliveryEta = "Delivered";

      // Increment partner's wallet earnings
      const partner = await User.findById(req.user._id);
      if (partner && partner.deliveryPartnerDetails) {
        partner.deliveryPartnerDetails.earnings.daily += 60;
        partner.deliveryPartnerDetails.earnings.weekly += 60;
        partner.deliveryPartnerDetails.earnings.monthly += 60;
        await partner.save();
      }
    } else if (status === "Failed") {
      desc = remarks || "Delivery attempt failed. Customer not available.";
      order.deliveryEta = "Attempt Failed";
    } else if (status === "Returned") {
      desc = "Package returned to seller inventory.";
      order.orderStatus = "Cancelled";
      order.deliveryEta = "Returned";
    }

    order.deliveryLiveLocation = {
      lat: lat || baseCoordinates.lat,
      lng: lng || baseCoordinates.lng
    };

    order.deliveryTimeline.push({
      status,
      description: desc,
      timestamp: new Date()
    });

    await order.save();
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error updating delivery status", error: error.message });
  }
};

// Fetch partner profile metrics, ratings, and wallet balances
exports.getPartnerEarnings = async (req, res) => {
  try {
    const partner = await User.findById(req.user._id);
    if (!partner || !partner.isDeliveryPartner) {
      return res.status(404).json({ message: "Delivery profile not found" });
    }

    const completedCount = await Order.countDocuments({
      deliveryPartnerId: req.user._id,
      deliveryStatus: "Delivered",
    });

    const pendingCount = await Order.countDocuments({
      deliveryPartnerId: req.user._id,
      deliveryStatus: { $in: ["Accepted", "Picked Up", "Out for Delivery"] }
    });

    const orders = await Order.find({ deliveryPartnerId: req.user._id }).sort({ updatedAt: -1 });

    res.status(200).json({
      details: partner.deliveryPartnerDetails,
      status: partner.deliveryPartnerStatus,
      completedDeliveries: completedCount,
      pendingDeliveries: pendingCount,
      history: orders
    });
  } catch (error) {
    res.status(500).json({ message: "Error loading earnings data", error: error.message });
  }
};
