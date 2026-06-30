const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(403).json({ message: "Access denied. Administrator privileges required." });
  }
};

const superAdminMiddleware = (req, res, next) => {
  if (req.user && req.user.isAdmin && req.user.adminRole === "Super Admin") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied. Super Administrator privileges required." });
  }
};

module.exports = {
  adminMiddleware,
  superAdminMiddleware,
};
