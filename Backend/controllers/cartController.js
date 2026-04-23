const Cart = require("../models/Cart");

// Get or Create Cart
exports.getCart = async (req, res) => {
  try {
    const { cartId } = req.params;
    let cart = await Cart.findOne({ cartId });

    if (!cart) {
      cart = new Cart({ cartId, items: [] });
      await cart.save();
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Cart Items
exports.updateCart = async (req, res) => {
  try {
    const { cartId } = req.params;
    const { items } = req.body;

    let cart = await Cart.findOneAndUpdate(
      { cartId },
      { items },
      { new: true, upsert: true }
    );

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
