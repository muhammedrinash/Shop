const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, ".env"),
});

console.log("ENV TEST:", process.env.MONGO_URI);

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// connect database
connectDB();

// middlewares
app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/carts", require("./routes/cartRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// ── Serve Frontend in Production ──────────────────────────────────────────
const frontendDist = path.join(__dirname, "..", "Frontend", "dist");
app.use(express.static(frontendDist));

// SPA catch-all: any non-API route serves index.html
app.use((req, res) => {
  res.sendFile(path.join(frontendDist, "index.html"));
});

const PORT = process.env.PORT || 2500;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});