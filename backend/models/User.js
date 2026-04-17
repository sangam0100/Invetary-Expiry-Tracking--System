const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ["admin", "staff", "user"],
    default: "staff"
  },
  mobile: String,
  dob: String,
  gender: String,
  dateOfJoining: String,
  lastLogin: Date,
  otp: String,
  otpExpiry: Date
});

module.exports = mongoose.model("User", userSchema);