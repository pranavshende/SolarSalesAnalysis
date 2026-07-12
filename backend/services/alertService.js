const analyticsService = require('./analyticsService');

const checkAlerts = async () => {
  const stateMetrics = await analyticsService.getStateMetrics();
  const alerts = [];

  stateMetrics.forEach(state => {
    // Alert 1: Capacity spike (>50% YoY)
    if (state.latestYoY > 50) {
      alerts.push({
        type: 'Demand Spike',
        message: `Explosive growth detected in ${state.state}. Capacity increased by ${state.latestYoY}% in the last period.`,
        severity: 'high'
      });
    }

    // Alert 2: Growth Drop (< -10% YoY)
    if (state.latestYoY < -10) {
      alerts.push({
        type: 'Growth Drop',
        message: `Significant slowdown in ${state.state}. Market momentum dropped by ${Math.abs(state.latestYoY)}%.`,
        severity: 'warning'
      });
    }

    // Alert 3: Low Efficiency
    const efficiency = state.totalRevenue / state.totalCapacity;
    if (efficiency < 0.001) { // Threshold for low ROI
      alerts.push({
        type: 'Revenue Concern',
        message: `${state.state} is showing below-average revenue efficiency. ROI may be delayed.`,
        severity: 'medium'
      });
    }
  });

  return alerts;
};

module.exports = { checkAlerts };
