const axios = require('axios');

async function testForecast() {
  try {
    const response = await axios.get('http://localhost:5000/api/analytics/forecast', {
      params: { state: 'Karnataka', city: 'All' },
      headers: { 
        'Authorization': 'Bearer ' + 'TOKEN_HERE' // I don't have a token easily, but I can check if it even hits the route
      }
    });
    console.log('Success:', response.data);
  } catch (err) {
    if (err.response) {
      console.log('Error Status:', err.response.status);
      console.log('Error Data:', err.response.data);
    } else {
      console.log('Error Message:', err.message);
    }
  }
}

// Since I don't have a token, I'll test the unprotected debug route if I can, 
// or I'll just create a new unprotected test route.

// Better yet, I'll check the code one more time.
