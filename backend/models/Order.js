const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customerName: String,

  products: [
    {
      name: String,
      price: Number,
      quantity: Number
    }
  ],

  totalAmount: Number,

  paymentStatus: {
    type: String,
    default: "Pending"
  },

  date: {
    type: Date,
    default: Date.now
  },

  mobile: String,

  dob: String,

  gender: String,

  customerType: {
    type: String,
    default: "consumer"
  }
});

module.exports = mongoose.model("Order", orderSchema);