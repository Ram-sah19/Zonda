const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  becomeSeller,
} = require("../controller/authController");
const authMiddleware = require("../middleware/authMiddleware");

// Route definitions
router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/me", authMiddleware, getUserProfile);
router.put("/become-seller", authMiddleware, becomeSeller);

module.exports = router;
