const router = require("express").Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createProduct,
  getProducts,
  getExpiringProducts,
  updateProduct,
  deleteProduct,
  getAdminProducts,
  deleteAdminProduct,
  assignProductUser
} = require("../controllers/productController");

const adminRoleMiddleware = require("../middleware/roleMiddlerware");

// CREATE
router.post("/", authMiddleware, createProduct);

// GET ALL
router.get("/", authMiddleware, getProducts);

// EXPIRING PRODUCTS
router.get("/expiring", authMiddleware, getExpiringProducts);

// UPDATE PRODUCT (IMPORTANT)
router.put("/:id", authMiddleware, updateProduct);

// DELETE
router.delete("/:id", authMiddleware, deleteProduct);

// Admin routes
router.get("/admin", authMiddleware, adminRoleMiddleware("admin"), getAdminProducts);
router.delete("/admin/:id", authMiddleware, adminRoleMiddleware("admin"), deleteAdminProduct);
router.put("/admin/:id/assign", authMiddleware, adminRoleMiddleware("admin"), assignProductUser);

module.exports = router;
