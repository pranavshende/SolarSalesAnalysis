const p = require('./config/prisma');
p.solarData.findMany({ where: { state: 'Karnataka', city: 'All' } }).then(data => {
  console.log(data);
  process.exit(0);
});
