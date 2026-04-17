const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");

// DASHBOARD STATS (global for admin, user-specific otherwise)
router.get("/stats", require("../middleware/authMiddleware"), async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isAdmin = req.user.role === 'admin';

    const products = isAdmin 
      ? await Product.find() 
      : await Product.find({ user: req.user.id });
    
    const orders = isAdmin 
      ? await Order.find() 
      : await Order.find({ user: req.user.id });

    const totalUsers = isAdmin ? await User.countDocuments() : null;

    let expired = 0;
    let expiring = 0;

    // EXPIRY CALCULATION 
    products.forEach(p => {
      if (!p.expiryDate) return;

      const expiry = new Date(p.expiryDate);
      expiry.setHours(0, 0, 0, 0);

      const diffDays = (expiry - today) / (1000 * 60 * 60 * 24);

      if (diffDays < 0) expired++;
      else if (diffDays <= 7) expiring++;
    });

    // SALES CALCULATION
    let totalSales = 0;
    let todaySales = 0;

    const now = new Date();

    orders.forEach(o => {
      totalSales += o.totalAmount || 0;

      const orderDate = new Date(o.date);

      if (
        orderDate.getDate() === now.getDate() &&
        orderDate.getMonth() === now.getMonth() &&
        orderDate.getFullYear() === now.getFullYear()
      ) {
        todaySales += o.totalAmount || 0;
      }
    });

    // MONTHLY SALES (for charts)
    const monthlySales = Array(12).fill(0);

    orders.forEach(o => {
      const month = new Date(o.date).getMonth();
      monthlySales[month] += o.totalAmount || 0;
    });

    // RESPONSE
    res.json({
      totalProducts: products.length,
      expiredProducts: expired,
      expiringProducts: expiring,
      totalOrders: orders.length,
      totalUsers,
      totalSales,
      todaySales,
      monthlySales
    });

  } catch (err) {
    console.log("❌ Dashboard Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

