const deliveryMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  if (!req.user.isDeliveryPartner) {
    return res.status(403).json({ message: "Access restricted: Delivery Partner role required" });
  }

  if (req.user.deliveryPartnerStatus !== "Approved") {
    return res.status(403).json({ 
      message: `Access denied. Your delivery profile is currently: ${req.user.deliveryPartnerStatus || 'Pending'}. Please wait for administrator approval.` 
    });
  }

  next();
};

module.exports = deliveryMiddleware;
