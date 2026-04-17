const express = require("express");
const router = express.Router();

const {
  register,
  adminRegister,
  login,
  sendOtp,
  verifyOtp
} = require("../controllers/authController");

// ================= AUTH ROUTES =================

// User Register 
router.post("/register", async (req, res, next) => {
  try {
    await register(req, res);
  } catch (err) {
    console.log("❌ Register Error:", err.message);
    next(err);
  }
});

// Admin Register - PROTECTED for super admin (manual DB or first admin)

// Login
router.post("/login", async (req, res, next) => {
  try {
    await login(req, res);
  } catch (err) {
    console.log("❌ Login Error:", err.message);
    next(err);
  }
});


// ================= OTP / FORGOT PASSWORD =================

// Send OTP
router.post("/send-otp", async (req, res, next) => {
  try {
    await sendOtp(req, res);
  } catch (err) {
    console.log("❌ Send OTP Error:", err.message);
    next(err);
  }
});

// Verify OTP
router.post("/verify-otp", async (req, res, next) => {
  try {
    await verifyOtp(req, res);
  } catch (err) {
    console.log("❌ Verify OTP Error:", err.message);
    next(err);
  }
});

/*
// 🔥 HEALTH CHECK (important for debugging)
router.get("/test", (req, res) => {
  res.send("Auth API Working ✅");
});

// 📱 TEST SMS ALERTS 
router.get("/test-sms", async (req, res) => {
  try {
    const { testSMSAlerts } = require("../utils/cronJob");
    await testSMSAlerts();
    res.json({ message: "SMS Alert Test Completed ✅", status: "success" });
  } catch (err) {
    console.log("❌ SMS Test Error:", err.message);
    res.status(500).json({ message: "SMS Test Failed ❌", error: err.message });
  }
});

*/
module.exports = router;