const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");

exports.getDashboardStats = async (req, res) => {
  const totalProducts = await Product.countDocuments();
  const totalOrders = await Order.countDocuments();
  const totalUsers = await User.countDocuments();

  const today = new Date();
  const next7Days = new Date();
  next7Days.setDate(today.getDate() + 7);

  const expiringProducts = await Product.countDocuments({
    expiryDate: { $gte: today, $lte: next7Days }
  });

  res.json({
    totalProducts,
    totalOrders,
    totalUsers,
    expiringProducts
  });
};