const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const {
  getStats,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  getAllUsers,
  deleteUser,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/adminController");

// All admin routes require auth + admin role
router.use(protect, admin);

router.get("/stats", getStats);

router.get("/orders", getAllOrders);
router.put("/orders/:id/status", updateOrderStatus);
router.delete("/orders/:id", deleteOrder);

router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);

router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

module.exports = router;
