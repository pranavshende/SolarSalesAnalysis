const express = require('express');
const passport = require('passport');
const { 
  getDashboardSummary, 
  getMarketShare, 
  getCityAnalysis, 
  getGrowthMetrics,
  getForecast,
  analyzeSatellite,
  getDetailedData
} = require('../controllers/analyticsController');

const router = express.Router();

router.get('/summary', passport.authenticate('jwt', { session: false }), getDashboardSummary);
router.get('/market-share', passport.authenticate('jwt', { session: false }), getMarketShare);
router.get('/cities', passport.authenticate('jwt', { session: false }), getCityAnalysis);
router.get('/growth', passport.authenticate('jwt', { session: false }), getGrowthMetrics);
router.get('/forecast', passport.authenticate('jwt', { session: false }), getForecast);
router.post('/analyze-satellite', passport.authenticate('jwt', { session: false }), analyzeSatellite);
router.get('/detailed', passport.authenticate('jwt', { session: false }), getDetailedData);

module.exports = router;
