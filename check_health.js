const axios = require('axios');

async function checkApp() {
  console.log('🔍 Checking system health...');

  try {
    const backendHealth = await axios.get('http://localhost:5000/health');
    console.log('✅ Backend: ONLINE');
    console.log(`   Message: ${backendHealth.data.message}`);
  } catch (err) {
    console.log('❌ Backend: OFFLINE or ERROR');
    console.error(`   Error: ${err.message}`);
  }

  try {
    const mlHealth = await axios.get('http://localhost:8000/');
    console.log('✅ ML Service: ONLINE');
    console.log(`   Message: ${JSON.stringify(mlHealth.data)}`);
  } catch (err) {
    console.log('❌ ML Service: OFFLINE or ERROR');
    console.error(`   Error: ${err.message}`);
  }
}

checkApp();
