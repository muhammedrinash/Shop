// Run this ONCE to make a user an admin:
// node makeAdmin.js your@email.com

require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const connectDB = require("./config/db");

const email = process.argv[2];
if (!email) {
  console.error("Usage: node makeAdmin.js <email>");
  process.exit(1);
}

connectDB().then(async () => {
  const user = await User.findOneAndUpdate(
    { email },
    { isAdmin: true },
    { new: true }
  );
  if (!user) {
    console.error(`❌ No user found with email: ${email}`);
  } else {
    console.log(`✅ ${user.name} (${user.email}) is now an Admin!`);
  }
  process.exit(0);
});
