const sequelize = require('./config/db');
const User = require('./models/User');
const SolarData = require('./models/SolarData');

async function verify() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connection has been established successfully.');

    const userCount = await User.count();
    const dataCount = await SolarData.count();

    console.log(`📊 Database Stats:`);
    console.log(`   - Users: ${userCount}`);
    console.log(`   - Solar Data Records: ${dataCount}`);

    if (dataCount === 0) {
      console.log('⚠️ Warning: No solar data found. You may need to run "npm run seed".');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error.message);
    process.exit(1);
  }
}

verify();
