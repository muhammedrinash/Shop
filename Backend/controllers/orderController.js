const Order = require("../models/Order");
const User = require("../models/User");

// CREATE order (requires auth)
exports.createOrder = async (req, res) => {
  try {
    const { items, totalPrice, phone, address } = req.body;

    // Get logged-in user's name from DB
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const order = new Order({
      userId: req.userId,
      customerName: user.name,
      phone: phone || "N/A",
      address: address || "N/A",
      items,
      totalPrice,
    });

    const saved = await order.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET orders for the logged-in user only
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};