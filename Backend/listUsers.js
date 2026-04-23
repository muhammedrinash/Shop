require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const connectDB = require("./config/db");

connectDB().then(async () => {
  const users = await User.find().select("-password");
  console.log("\n=== ALL REGISTERED USERS ===");
  users.forEach(u => {
    console.log(`Name: ${u.name} | Email: ${u.email} | Admin: ${u.isAdmin}`);
  });
  console.log("============================\n");
  process.exit(0);
});
