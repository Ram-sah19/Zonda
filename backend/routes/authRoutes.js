const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require("../controller/authController");
const authMiddleware = require("../middleware/authMiddleware");

// Route definitions
router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/me", authMiddleware, getUserProfile);

module.exports = router;
