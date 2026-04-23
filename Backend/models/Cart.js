const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    cartId: {
      type: String,
      required: true,
      unique: true,
    },
    items: [
      {
        _id: String,
        name: String,
        price: Number,
        image: String,
        category: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
