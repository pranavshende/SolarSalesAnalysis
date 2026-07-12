const prisma = require('../config/prisma');

const getYearlySummary = async (filters = {}) => {
  const finalFilters = { ...filters, city: 'All' };
  
  const summary = await prisma.solarData.groupBy({
    by: ['year'],
    where: finalFilters,
    _sum: {
      capacity_kW: true,
      revenue_Cr: true
    },
    _count: {
      id: true
    },
    orderBy: {
      year: 'asc'
    }
  });

  return summary.map(s => ({
    year: s.year,
    capacity: s._sum.capacity_kW || 0,
    revenue: s._sum.revenue_Cr || 0
  }));
};

const getMarketShare = async (year) => {
  const data = await prisma.solarData.groupBy({
    by: ['state'],
    where: { year: parseInt(year), city: 'All' },
    _sum: {
      capacity_kW: true
    }
  });

  const totalCapacity = data.reduce((sum, item) => sum + (item._sum.capacity_kW || 0), 0);

  return data.map(item => ({
    state: item.state,
    capacity: item._sum.capacity_kW || 0,
    marketShare_pct: totalCapacity > 0 ? ((item._sum.capacity_kW || 0) / totalCapacity) * 100 : 0
  })).sort((a, b) => b.capacity - a.capacity);
};

const calculateCAGR = (startVal, endVal, periods) => {
  if (periods <= 0 || startVal <= 0) return 0;
  return (Math.pow(endVal / startVal, 1 / periods) - 1) * 100;
};

const getStateMetrics = async () => {
  const states = await prisma.solarData.findMany({
    select: { state: true },
    distinct: ['state']
  });
  
  const stateList = states.map(s => s.state).filter(s => s && s !== 'nan' && s !== 'Unknown');
  const metrics = [];

  for (const state of stateList) {
    const data = await prisma.solarData.groupBy({
      by: ['year'],
      where: { state, city: 'All' },
      _sum: { capacity_kW: true, revenue_Cr: true },
      orderBy: { year: 'asc' }
    });
    
    if (data.length < 2) continue;

    const firstYearData = data[0];
    const lastYearData = data[data.length - 1];
    const periods = lastYearData.year - firstYearData.year;

    const firstCap = firstYearData._sum.capacity_kW || 0;
    const lastCap = lastYearData._sum.capacity_kW || 0;
    const cagr = calculateCAGR(firstCap, lastCap, periods);
    
    const latestYear = lastYearData.year;
    const prevYear = latestYear - 1;
    const prevRow = data.find(d => d.year === prevYear);
    const prevData = prevRow ? (prevRow._sum.capacity_kW || 0) : 0;
    
    let yoy = 0;
    if (prevData > 0) {
      yoy = ((lastCap - prevData) / prevData) * 100;
    } else if (lastCap > 0) {
      yoy = 100;
    }

    const topCities = await prisma.solarData.groupBy({
      by: ['city'],
      where: { state, year: latestYear, city: { not: 'All' } },
      _sum: { capacity_kW: true },
      orderBy: { _sum: { capacity_kW: 'desc' } },
      take: 3
    });

    const totalRev = data.reduce((sum, row) => sum + (row._sum.revenue_Cr || 0), 0);

    metrics.push({
      state,
      cagr: parseFloat(cagr.toFixed(2)),
      latestYoY: parseFloat(yoy.toFixed(2)),
      totalCapacity: lastCap,
      totalRevenue: totalRev,
      topCities: topCities.map(c => ({ name: c.city, capacity: c._sum.capacity_kW || 0 }))
    });
  }

  return metrics.sort((a, b) => b.totalCapacity - a.totalCapacity);
};

const getCityMetrics = async (state) => {
  const where = state ? { state, city: { not: 'All' } } : { city: { not: 'All' } };
  
  const maxYearRow = await prisma.solarData.aggregate({
    _max: { year: true }
  });
  const latestYear = maxYearRow._max.year || new Date().getFullYear();
  
  where.year = latestYear;
  
  const cities = await prisma.solarData.groupBy({
    by: ['state', 'city'],
    where,
    _sum: { capacity_kW: true, revenue_Cr: true },
    _max: { year: true },
    orderBy: { _sum: { capacity_kW: 'desc' } }
  });

  return cities.map(c => ({
    state: c.state,
    city: c.city,
    capacity: c._sum.capacity_kW || 0,
    revenue: c._sum.revenue_Cr || 0,
    latestYear: c._max.year
  }));
};

const getDetailedAnalytics = async (type = 'state') => {
  const isCity = type === 'city';
  
  const queryAttrs = isCity ? ['city', 'state'] : ['state'];
    
  const entities = await prisma.solarData.groupBy({
    by: queryAttrs,
    where: isCity ? { city: { not: 'All' } } : { city: 'All' }
  });

  const metrics = [];

  for (const entity of entities) {
    const whereClause = isCity 
      ? { city: entity.city, state: entity.state } 
      : { state: entity.state, city: 'All' };

    const data = await prisma.solarData.groupBy({
      by: ['year'],
      where: whereClause,
      _sum: { capacity_kW: true, revenue_Cr: true },
      orderBy: { year: 'asc' }
    });
    
    if (data.length === 0) continue;

    const firstYearData = data[0];
    const lastYearData = data[data.length - 1];
    const periods = lastYearData.year - firstYearData.year;

    const firstCap = firstYearData._sum.capacity_kW || 0;
    const lastCap = lastYearData._sum.capacity_kW || 0;
    const cagr = calculateCAGR(firstCap, lastCap, periods);
    
    const latestYear = lastYearData.year;
    const prevYear = latestYear - 1;
    const prevRow = data.find(d => d.year === prevYear);
    const prevData = prevRow ? (prevRow._sum.capacity_kW || 0) : 0;
    
    let yoy = 0;
    if (prevData > 0) {
      yoy = ((lastCap - prevData) / prevData) * 100;
    } else if (lastCap > 0) {
      yoy = 100;
    }

    const totalRev = data.reduce((sum, row) => sum + (row._sum.revenue_Cr || 0), 0);

    metrics.push({
      name: isCity ? entity.city : entity.state,
      state: entity.state,
      type: isCity ? 'City' : 'State',
      cagr: parseFloat(cagr.toFixed(2)),
      latestYoY: parseFloat(yoy.toFixed(2)),
      totalCapacity: lastCap,
      totalRevenue: totalRev
    });
  }

  return metrics.sort((a, b) => b.totalCapacity - a.totalCapacity);
};

module.exports = {
  getYearlySummary,
  getMarketShare,
  getStateMetrics,
  getCityMetrics,
  getDetailedAnalytics
};
