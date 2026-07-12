const db = require('./backend/config/db');
db.query('SELECT year, SUM("capacity_kW") FROM "SolarData" GROUP BY year ORDER BY year;')
  .then(r => console.log(r[0]))
  .catch(console.error)
  .finally(() => process.exit(0));
