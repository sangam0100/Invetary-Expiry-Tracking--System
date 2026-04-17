const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const Order = require("../models/Order");
const generateInvoice = require("../utils/generateInvoice");


// ✅ 1. CREATE ORDER UPDATED 
router.post("/create", async (req, res) => {
  try {
    const { customerName, mobile, dob, gender, products, customerType } = req.body;

    //  Validation
    if (!customerName || !mobile || !products || products.length === 0) {
      return res.status(400).json({ error: "Fill all required fields" });
    }

    let totalAmount = 0;

    const formattedProducts = products.map(p => {
      const price = Number(p.price) || 0;
      const quantity = Number(p.quantity) || 0;

      totalAmount += price * quantity;

      return {
        name: p.name,
        price,
        quantity
      };
    });

    const order = new Order({
      customerName,
      mobile,
      dob,
      gender,
      products: formattedProducts,
      totalAmount,
      customerType: customerType || "consumer"
    });

    await order.save();
    res.status(201).json(order);

  } catch (err) {
    console.log("❌ Create Order Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});


// ✅ 2. GET ALL ORDERS
router.get("/", async (req, res) => {
  try {
    const { type } = req.query;

    let filter = {};
    if (type) filter.customerType = type;

    const orders = await Order.find(filter).sort({ date: -1 });

    res.json(orders);

  } catch (err) {
    console.log("❌ Fetch Orders Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});


// ✅ 3. GET SINGLE ORDER
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);

  } catch (err) {
    console.log("❌ Get Order Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});


// ✅ 4. PAYMENT UPDATE
router.put("/payment/:id", async (req, res) => {
  try {
    const { status } = req.body;

    const validStatus = ["Pending", "Paid"];

    if (!validStatus.includes(status)) {
      return res.status(400).json({ error: "Invalid payment status" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus: status },
      { new: true }
    );

    res.json(order);

  } catch (err) {
    console.log("❌ Payment Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});


// ✅ 5. DELETE ORDER
router.delete("/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ message: "Order deleted" });

  } catch (err) {
    console.log("❌ Delete Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});


// ✅ 6. 📊 SALES SUMMARY
router.get("/sales/summary", async (req, res) => {
  try {
    const orders = await Order.find();

    let totalSales = 0;

    orders.forEach(o => totalSales += o.totalAmount);

    res.json({
      totalOrders: orders.length,
      totalSales
    });

  } catch (err) {
    console.log("❌ Sales Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});


// ✅ 7. 🧾 INVOICE PREVIEW DATA
router.get("/invoice-data/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);

  } catch (err) {
    console.log("❌ Invoice Data Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});


// ✅ 8. 🧾 GENERATE PDF
router.get("/invoice/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const fileName = `invoice_${order._id}.pdf`;
    const filePath = path.join(__dirname, "..", "invoices", fileName);

    // Ensure folder exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    generateInvoice(order, filePath);

    // Set PDF headers
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${fileName}"`
    });

    setTimeout(() => {
      if (fs.existsSync(filePath)) {
        res.download(filePath, fileName, (err) => {
          if (err) {
            console.log("❌ Download Error:", err.message);
            fs.unlink(filePath, (unlinkErr) => {
              if (unlinkErr) console.log("❌ Cleanup Error:", unlinkErr.message);
            });
          } else {
            // Don't delete on success - let server handle
            console.log("✅ PDF Downloaded:", fileName);
          }
        });
      } else {
        console.log("❌ PDF not ready:", filePath);
        res.status(500).json({ error: "PDF generation failed - file not ready" });
      }
    }, 1500);

  } catch (err) {
    console.log("❌ Invoice Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;