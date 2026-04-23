const express = require("express");
const router = express.Router();

const { getCart, updateCart } = require("../controllers/cartController");

router.get("/:cartId", getCart);
router.post("/:cartId", updateCart);

module.exports = router;
