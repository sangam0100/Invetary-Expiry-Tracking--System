const Product = require("../models/Product");

// new product create karne ke liyi
exports.createProduct = async (req, res) => {
  try {
    const productData = { ...req.body, user: req.user.id };
    const product = await Product.create(productData);
    res.json(product);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// sare product dekhne ke liyi 
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({ user: req.user.id });
    res.json(products);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

//kon sa product 7 din baad expired hone wala hain
exports.getExpiringProducts = async (req, res) => {
  try {
    const today = new Date();
    const next7Days = new Date();

    next7Days.setDate(today.getDate() + 7);


    today.setHours(0, 0, 0, 0);
    next7Days.setHours(23, 59, 59, 999);

    const products = await Product.find({
      user: req.user.id,
      expiryDate: {
        $gte: today,
        $lte: next7Days
      }
    });

    res.json(products);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// product ko update karne ke liyi 
exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json("Product not found");
    }

    if (updatedProduct.user.toString() !== req.user.id.toString()) {
      return res.status(403).json("Not authorized to update this product");
    }

    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// product ko delete karne ke liyi hain
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json("Product not found");
    }
    if (product.user.toString() !== req.user.id.toString()) {
      return res.status(403).json("Not authorized to delete this product");
    }
    await Product.findByIdAndDelete(req.params.id);
  res.json("Deleted successfully");
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// Admin: Get all products with user info
exports.getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('user', 'name email role mobile');
    res.json(products);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// Admin: Delete any product
exports.deleteAdminProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json("Product not found");
    }
    res.json("Product deleted by admin");
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// Admin: Assign product to different user
exports.assignProductUser = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json("userId required");
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { user: userId },
      { new: true }
    ).populate('user', 'name email');
    if (!updatedProduct) {
      return res.status(404).json("Product not found");
    }
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

