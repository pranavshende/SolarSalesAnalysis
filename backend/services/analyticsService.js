const SolarData = require('../models/SolarData');
const { Op, fn, col } = require('sequelize');

const getYearlySummary = async (filters = {}) => {
  // Ensure we only sum state totals, avoiding city-level duplicates
  const finalFilters = { ...filters, city: 'All' };
  
  const summary = await SolarData.findAll({
    where: finalFilters,
    attributes: [
      'year',
      [fn('SUM', col('capacity_kW')), 'totalCapacity_kW'],
      [fn('SUM', col('revenue_Cr')), 'totalRevenue_Cr'],
      [fn('COUNT', col('id')), 'count']
    ],
    group: ['year'],
    order: [['year', 'ASC']],
    raw: true
  });

  return summary.map(s => ({
    year: s.year,
    capacity: parseFloat(s.totalCapacity_kW),
    revenue: parseFloat(s.totalRevenue_Cr)
  }));
};

const getMarketShare = async (year) => {
  const data = await SolarData.findAll({
    where: { year: parseInt(year), city: 'All' },
    attributes: [
      'state',
      [fn('SUM', col('capacity_kW')), 'capacity']
    ],
    group: ['state'],
    raw: true
  });

  const totalCapacity = data.reduce((sum, item) => sum + parseFloat(item.capacity), 0);

  return data.map(item => ({
    state: item.state,
    capacity: parseFloat(item.capacity),
    marketShare_pct: totalCapacity > 0 ? (parseFloat(item.capacity) / totalCapacity) * 100 : 0
  })).sort((a, b) => b.capacity - a.capacity);
};

const calculateCAGR = (startVal, endVal, periods) => {
  if (periods <= 0 || startVal <= 0) return 0;
  return (Math.pow(endVal / startVal, 1 / periods) - 1) * 100;
};

const getStateMetrics = async () => {
  const states = await SolarData.findAll({
    attributes: [[fn('DISTINCT', col('state')), 'state']],
    raw: true
  });
  
  const stateList = states.map(s => s.state).filter(s => s && s !== 'nan' && s !== 'Unknown');
  const metrics = [];

  for (const state of stateList) {
    const data = await SolarData.findAll({
      where: { state, city: 'All' },
      attributes: [
        'year',
        [fn('SUM', col('capacity_kW')), 'capacity_kW'],
        [fn('SUM', col('revenue_Cr')), 'revenue_Cr']
      ],
      group: ['year'],
      order: [['year', 'ASC']],
      raw: true
    });
    
    if (data.length < 2) continue;

    const firstYearData = data[0];
    const lastYearData = data[data.length - 1];
    const periods = lastYearData.year - firstYearData.year;

    const firstCap = parseFloat(firstYearData.capacity_kW) || 0;
    const lastCap = parseFloat(lastYearData.capacity_kW) || 0;
    const cagr = calculateCAGR(firstCap, lastCap, periods);
    
    // Growth Momentum (latest YoY)
    const latestYear = lastYearData.year;
    const prevYear = latestYear - 1;
    const prevRow = data.find(d => d.year === prevYear);
    const prevData = prevRow ? (parseFloat(prevRow.capacity_kW) || 0) : 0;
    
    let yoy = 0;
    if (prevData > 0) {
      yoy = ((lastCap - prevData) / prevData) * 100;
    } else if (lastCap > 0) {
      yoy = 100; // Represents a 100% jump from nothing to something
    }

    // Get Top Cities for the latest year
    const topCities = await SolarData.findAll({
      where: { state, year: latestYear, city: { [Op.ne]: 'All' } },
      attributes: [
        'city',
        [fn('SUM', col('capacity_kW')), 'capacity']
      ],
      group: ['city'],
      order: [[fn('SUM', col('capacity_kW')), 'DESC']],
      limit: 3,
      raw: true
    });

    const totalRev = data.reduce((sum, row) => sum + (parseFloat(row.revenue_Cr) || 0), 0);

    metrics.push({
      state,
      cagr: parseFloat(cagr.toFixed(2)),
      latestYoY: parseFloat(yoy.toFixed(2)),
      totalCapacity: lastCap,
      totalRevenue: totalRev,
      topCities: topCities.map(c => ({ name: c.city, capacity: parseFloat(c.capacity) }))
    });
  }

  return metrics.sort((a, b) => b.totalCapacity - a.totalCapacity);
};

const getCityMetrics = async (state) => {
  const where = state ? { state, city: { [Op.ne]: 'All' } } : { city: { [Op.ne]: 'All' } };
  
  // First, find the latest year in the dataset
  const maxYearRow = await SolarData.findOne({
    attributes: [[fn('MAX', col('year')), 'latestYear']],
    raw: true
  });
  const latestYear = maxYearRow ? maxYearRow.latestYear : new Date().getFullYear();
  
  // Then get city metrics for that specific year to avoid summing cumulative past years
  where.year = latestYear;
  
  const cities = await SolarData.findAll({
    where,
    attributes: [
      'state',
      'city',
      [fn('SUM', col('capacity_kW')), 'totalCapacity'],
      [fn('SUM', col('revenue_Cr')), 'totalRevenue'],
      [fn('MAX', col('year')), 'latestYear']
    ],
    group: ['state', 'city'],
    order: [[fn('SUM', col('capacity_kW')), 'DESC']],
    raw: true
  });

  return cities.map(c => ({
    state: c.state,
    city: c.city,
    capacity: parseFloat(c.totalCapacity),
    revenue: parseFloat(c.totalRevenue),
    latestYear: c.latestYear
  }));
};

const getDetailedAnalytics = async (type = 'state') => {
  const isCity = type === 'city';
  
  // Get all unique entities
  const queryAttrs = isCity 
    ? ['city', 'state'] 
    : ['state'];
    
  const entities = await SolarData.findAll({
    where: isCity ? { city: { [Op.ne]: 'All' } } : { city: 'All' },
    attributes: queryAttrs,
    group: queryAttrs,
    raw: true
  });

  const metrics = [];

  for (const entity of entities) {
    const whereClause = isCity 
      ? { city: entity.city, state: entity.state } 
      : { state: entity.state, city: 'All' };

    const data = await SolarData.findAll({
      where: whereClause,
      attributes: [
        'year',
        [fn('SUM', col('capacity_kW')), 'capacity_kW'],
        [fn('SUM', col('revenue_Cr')), 'revenue_Cr']
      ],
      group: ['year'],
      order: [['year', 'ASC']],
      raw: true
    });
    
    if (data.length === 0) continue;

    const firstYearData = data[0];
    const lastYearData = data[data.length - 1];
    const periods = lastYearData.year - firstYearData.year;

    const firstCap = parseFloat(firstYearData.capacity_kW) || 0;
    const lastCap = parseFloat(lastYearData.capacity_kW) || 0;
    const cagr = calculateCAGR(firstCap, lastCap, periods);
    
    // Growth Momentum (latest YoY)
    const latestYear = lastYearData.year;
    const prevYear = latestYear - 1;
    const prevRow = data.find(d => d.year === prevYear);
    const prevData = prevRow ? (parseFloat(prevRow.capacity_kW) || 0) : 0;
    
    let yoy = 0;
    if (prevData > 0) {
      yoy = ((lastCap - prevData) / prevData) * 100;
    } else if (lastCap > 0) {
      yoy = 100; // Represents a 100% jump from nothing to something
    }

    const totalRev = data.reduce((sum, row) => sum + (parseFloat(row.revenue_Cr) || 0), 0);

    metrics.push({
      name: isCity ? entity.city : entity.state,
      state: entity.state, // Useful for grouping
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
