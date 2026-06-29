const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  getSellerProducts,
  createProduct,
  updateProduct,
  deleteProduct
} = require("../controller/productController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", getAllProducts);
router.get("/seller/me", authMiddleware, getSellerProducts);
router.get("/:id", getProductById);
router.post("/", authMiddleware, createProduct);
router.put("/:id", authMiddleware, updateProduct);
router.delete("/:id", authMiddleware, deleteProduct);

module.exports = router;
