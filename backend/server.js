const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();

// Connect to database 
connectDB();

const app = express();

// Middleware connection
app.use(express.json());
app.use(cors());

// Root Route IMPORTANT for browser test
app.get("/", (req, res) => {
  res.send("Server Working ✅");
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

// Error Handling (optional but useful)
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(500).json("Server Error");
});

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);

  const { scheduleDailyAlerts, checkAndSendAlerts } = require("./utils/cronJob");

  scheduleDailyAlerts();

  checkAndSendAlerts()
    .catch((err) => console.error("❌ Startup alert check failed:", err));
});
