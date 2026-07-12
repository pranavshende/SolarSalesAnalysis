const analyticsService = require('../services/analyticsService');
const axios = require('axios');
const prisma = require('../config/prisma');

const getDashboardSummary = async (req, res) => {
  try {
    const filters = req.query.state ? { state: req.query.state } : {};
    const yearly = await analyticsService.getYearlySummary(filters);
    const stateMetrics = await analyticsService.getStateMetrics();
    
    const totals = stateMetrics.reduce((acc, curr) => ({
      capacity: acc.capacity + curr.totalCapacity,
      revenue: acc.revenue + curr.totalRevenue
    }), { capacity: 0, revenue: 0 });

    console.log(`Summary requested. Found ${yearly.length} yearly records and ${stateMetrics.length} state metrics.`);
    console.log('Totals:', totals);

    res.json({
      summary: yearly,
      stateMetrics,
      totals,
      topPerformers: stateMetrics.slice(0, 5),
      bottomPerformers: [...stateMetrics].reverse().slice(0, 5)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMarketShare = async (req, res) => {
  try {
    const { year } = req.query;
    if (!year) return res.status(400).json({ message: 'Year is required' });
    const marketShare = await analyticsService.getMarketShare(year);
    res.json(marketShare);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getCityAnalysis = async (req, res) => {
  try {
    const { state } = req.query;
    const cityMetrics = await analyticsService.getCityMetrics(state);
    res.json(cityMetrics);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getGrowthMetrics = async (req, res) => {
  try {
    const stateMetrics = await analyticsService.getStateMetrics();
    
    const growthData = stateMetrics.map(s => {
      // Calculate demand index based on capacity and growth
      // Higher capacity + higher growth = higher demand index
      const capacityScore = Math.min(s.totalCapacity / 10000, 50); // Cap at 50 points
      const growthScore = Math.min(s.latestYoY * 2, 50); // Cap at 50 points
      const demandIndex = Math.max(10, Math.min(95, capacityScore + growthScore));

      return {
        state: s.state,
        growthMomentum: s.latestYoY,
        demandIndex: parseFloat(demandIndex.toFixed(2)),
        totalCapacity: s.totalCapacity
      };
    });
    
    res.json(growthData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getForecast = async (req, res) => {
  try {
    const { state, city } = req.query;
    if (!state) return res.status(400).json({ message: 'State is required for forecasting' });

    const matchQuery = { state };
    if (city && city !== 'All') {
      matchQuery.city = city;
    }

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

    const historical_data = historical.map(h => ({ 
      year: parseInt(h.year), 
      capacity: Math.max(0, parseFloat(h._sum.capacity_kW || 0)) 
    }));
    
    if (historical_data.length < 2) {
      return res.status(400).json({ message: 'Insufficient historical data for this selection' });
    }

    const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:8000';
    
    try {
      const mlResponse = await axios.post(`${mlServiceUrl}/forecast`, {
        state,
        historical_data,
        forecast_years: 6
      });

      res.json({
        state,
        historical: historical_data,
        forecast: mlResponse.data.forecast.map(f => ({
          ...f,
          predicted_capacity: Math.max(0, f.predicted_capacity || 0),
          confidence_interval_low: Math.max(0, f.confidence_interval_low || 0),
          confidence_interval_high: Math.max(0, f.confidence_interval_high || 0)
        })),
        modelUsed: mlResponse.data.model_used
      });
    } catch (mlErr) {
      console.error('ML Service Error:', mlErr.message);
      
      if (!historical_data || historical_data.length === 0) {
        return res.status(404).json({ message: 'No historical data available for fallback forecast' });
      }

      const lastYearRecord = historical_data[historical_data.length - 1];
      const lastYear = lastYearRecord ? lastYearRecord.capacity : 0;
      const currentYear = new Date().getFullYear();

      const fallbackForecast = Array.from({ length: 6 }, (_, i) => ({
        year: currentYear + i,
        predicted_capacity: lastYear * (1 + (i + 1) * 0.1),
        confidence_interval_low: lastYear * (1 + (i + 1) * 0.05),
        confidence_interval_high: lastYear * (1 + (i + 1) * 0.15),
      }));

      res.json({
        state,
        historical: historical_data,
        forecast: fallbackForecast,
        modelUsed: 'Simple Linear Fallback'
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const analyzeSatellite = async (req, res) => {
  try {
    const { image_base64, zoom_level } = req.body;
    if (!image_base64) return res.status(400).json({ message: 'Image data is required' });

    const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:8000';
    
    const mlResponse = await axios.post(`${mlServiceUrl}/analyze-satellite`, {
      image_base64,
      zoom_level
    });

    res.json(mlResponse.data);
  } catch (err) {
    console.error('Satellite Analysis Error:', err.message);
    res.status(500).json({ message: 'Analysis engine failed', error: err.message });
  }
};

const getDetailedData = async (req, res) => {
  try {
    const { type } = req.query; // 'state' or 'city'
    const analyticsData = await analyticsService.getDetailedAnalytics(type || 'state');
    res.json(analyticsData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getDashboardSummary,
  getMarketShare,
  getCityAnalysis,
  getGrowthMetrics,
  getForecast,
  analyzeSatellite,
  getDetailedData
};
