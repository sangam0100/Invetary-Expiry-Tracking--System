const Order = require("../models/Order");
const sendSMS = require("../utils/sendSMS");

exports.createOrder = async (req, res) => {
  const order = await Order.create(req.body);
  
  // SMS alert bhejta hian 
  const message = `New Order Created: ${order.customerName} - Total: ₹${order.products.reduce((sum, p) => sum + (p.price * p.quantity), 0)}`;
  await sendSMS(message);
  
  res.json(order);
};

exports.getOrders = async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
};