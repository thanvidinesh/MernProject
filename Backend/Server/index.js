const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const sendOrderMail = require("./sendmail");
const Order = require("./models/Order");
const Product = require("./models/Product");
const Razorpay = require("razorpay");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

mongoose.connect("mongodb://127.0.0.1:27017/authDB")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true }
});

const User = mongoose.model("User", userSchema);

const razorpay = new Razorpay({
  key_id: "rzp_test_SeBSYsw7z1hemk",
  key_secret: "SJ1wwrVzHCV2OVwQZe7w6LHW",
});

// Routes

app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

app.post("/signup", async (req, res) => {
  const { email, phone, password } = req.body;
  if (!email || !phone || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, phone, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "Signup successful ✅" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    res.json({ message: "Login successful " });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/products", upload.single("image"), async (req, res) => {
  const { name, price, description, category } = req.body;
  if (!name || !price || !description || !category) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const newProduct = new Product({
      name,
      price: Number(price),
      description,
      category,
      image: req.file ? req.file.filename : null
    });
    await newProduct.save();
    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.put("/products/:id", async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/products/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/create-razorpay-order", async (req, res) => {
  try {
    const { amount } = req.body;
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/save-order", async (req, res) => {
  try {
    const { cart, total, totalQty, user, paymentMethod, upiId, paymentId } = req.body;

    const newOrder = new Order({
      items: cart.map(item => ({
        productId: item._id || item.id || "",
        name: item.name,
        price: Number(item.price),
        qty: item.qty || 1,
        image: item.image
      })),
      totalAmount: total,
      totalQty,
      user,
      paymentMethod,
      paymentId: upiId || paymentId || null
    });

    const savedOrder = await newOrder.save();
    await sendOrderMail(user.email, savedOrder._id, total);

    res.json({ message: "Order saved & email sent successfully!", order: savedOrder });

  } catch (error) {
    res.status(500).json({ message: "Failed", error: error.message });
  }
});

app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders" });
  }
});

app.put("/orders/:id", async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating status" });
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
