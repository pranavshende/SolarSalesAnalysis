const prisma = require('./config/prisma');

async function test() {
  const matchQuery = { state: 'Karnataka' };
  const historical = await prisma.solarData.groupBy({
    by: ['year'],
    where: matchQuery,
    _sum: {
      capacity_kW: true
    },
    orderBy: {
      year: 'asc'
    }
  });

  console.log(historical);
  process.exit(0);
}
test();
