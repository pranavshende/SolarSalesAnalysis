const sequelize = require('./config/db');
const { processFile } = require('./services/dataProcessor');
const User = require('./models/User');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Connected to PostgreSQL');
    
    // Sync models
    await sequelize.sync({ alter: true });
    console.log('Database synced');

    // Create a default admin user if not exists
    let adminUser = await User.findOne({ where: { email: 'admin@solar.com' } });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'Admin User',
        email: 'admin@solar.com',
        password: 'adminpassword123',
        role: 'Admin',
        isVerified: true
      });
      console.log('Created admin user');
    }

    // Clear old data to prevent double-counting
    const SolarData = require('./models/SolarData');
    await SolarData.destroy({ where: {} });
    console.log('Cleared existing SolarData records');

    const userId = adminUser.id;
    
    const stateFilePath = path.resolve(__dirname, '..', 'output', 'solar_sales_analysis.csv');
    console.log(`Processing ${stateFilePath}...`);
    const stateResult = await processFile(stateFilePath, 'csv', userId);
    console.log(`State-wise data seeded: ${stateResult.count} records`);

    const cityFilePath = path.resolve(__dirname, '..', 'data', 'city_wise_solar_2014_2024.csv');
    console.log(`Processing ${cityFilePath}...`);
    const cityResult = await processFile(cityFilePath, 'csv', userId);
    console.log(`City-wise data seeded: ${cityResult.count} records`);
    
    console.log('Seed successful!');
    console.log(`Total Records: ${stateResult.count + cityResult.count}`);

    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seed();
