const mongoose = require('mongoose');
const User = require('./backend/models/User');
const dotenv = require('dotenv');

dotenv.config({ path: './backend/.env' });

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  const users = await User.find({}, { email: 1, otp: 1, isVerified: 1 });
  console.log(JSON.stringify(users, null, 2));
  process.exit(0);
}

check();
