const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const validator = require("validator");
const sendEmail = require("../utils/sendEmail");

// ================= ADMIN REGISTER  karne ke liyi form  =================
exports.adminRegister = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role = 'staff',
      mobile,
      dob,
      gender,
      dateOfJoining
    } = req.body;

    // Validation check for admin
    if (!validator.isEmail(email)) {
      return res.status(400).json("Invalid email");
    }

    if (password.length < 6) {
      return res.status(400).json("Password must be at least 6 characters");
    }

    // Check user already exists karta hain ki nhi 
    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json("User already exists");

    // Convert plain password into hashed form for secure storage
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      mobile,
      dob,
      gender,
      dateOfJoining
    });

    res.json("User registered successfully");
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// ================= REGISTER page design kiya hu  =================
exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      captchaToken,
      role = 'user',
      mobile,
      dob,
      gender,
      dateOfJoining
    } = req.body;

    // check Validation for email
    if (!validator.isEmail(email)) {
      return res.status(400).json("Invalid email");
    }

    if (password.length < 6) {
      return res.status(400).json("Password must be at least 6 characters");
    }

    //Check user already exists
    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json("User already exists");

    // ✅ TEMP DISABLED CAPTCHA - Fix auth issue (add RECAPTCHA_SECRET to .env later)
    // if (captchaToken) {
    //   const verify = await axios.post(...)
    //   if (!verify.data.success) return res.status(400).json("Captcha failed");
    // }
    console.log("✅ Captcha bypassed for register");

    //// Convert plain password into hashed form for secure storage
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      mobile,
      dob,
      gender,
      dateOfJoining
    });

    res.json("User registered successfully");
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password, captchaToken } = req.body;

    // ✅ TEMP DISABLED CAPTCHA - Fix auth issue (add RECAPTCHA_SECRET to .env later)
    // const verify = await axios.post(...)
    // if (!verify.data.success) return res.status(400).json("Captcha failed");
    console.log("✅ Captcha bypassed for login");

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json("User not found");

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).json("Wrong password");

    // Update last login kab kiya tha main 
    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// ================= SEND OTP request ke liyi  =================
exports.sendOtp = async (req, res) => {
  try {
    console.log("Request body:", req.body); 

    const { email, phone } = req.body;
    console.log("Email:", email, "Phone:", phone);

    const user = email 
      ? await User.findOne({ email }) 
      : await User.findOne({ phone });

    if (!user) return res.status(400).json("User not found");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("Generated OTP:", otp); 

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();

    console.log("User saved with OTP:", user);

    res.json({ success: true, message: "OTP sent", otp });
  } catch (err) {
    console.error("❌ OTP Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
// ================= VERIFY OTP check karne ke liyi hain  =================
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json("User not found");

    // invalid / expired otp toh nhi na ho gya hain 
    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json("Invalid or expired OTP");
    }

    // update password karne ke liyi
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.json("Password updated successfully");
  } catch (err) {
    res.status(500).json(err.message);
  }
};