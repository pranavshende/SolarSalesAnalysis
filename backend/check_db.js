const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

async function check() {
  try {
    console.log('Connecting to:', process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI);
    const SolarData = require('./models/SolarData');
    const data = await SolarData.aggregate([
      { 
        $group: { 
          _id: '$state', 
          count: { $sum: 1 }, 
          uniqueYears: { $addToSet: '$year' },
          totalCapacity: { $sum: '$capacity_kW' },
          totalRevenue: { $sum: '$revenue_Cr' }
        } 
      }
    ]);
    console.log(JSON.stringify(data, null, 2));
    process.exit(0);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}

check();
