const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, default: 0 }, // quantity field added
  expiryDate: { type: Date, required: true },
  lastAlertSent: { type: Date }, // track when alert was last sent for this product
  ownerPhone: { type: String }, // store owner phone number
  ownerEmail: { type: String }, // optional: email alert
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model("Product", productSchema);