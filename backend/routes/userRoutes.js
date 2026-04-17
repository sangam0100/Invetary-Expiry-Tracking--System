const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const adminRoleMiddleware = require("../middleware/roleMiddlerware");

// GET all users
router.get("/", authMiddleware, adminRoleMiddleware("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// TEMP DEBUG ENDPOINT - check specific user
router.get("/debug/:email", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email }).select("-password");
    if (!user) return res.status(404).json("User not found");
    res.json(user);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// DELETE user by ID
router.delete("/:id", authMiddleware, adminRoleMiddleware("admin"), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json("User not found");
    res.json("User deleted successfully");
  } catch (err) {
    res.status(500).json(err.message);
  }
});


module.exports = router;