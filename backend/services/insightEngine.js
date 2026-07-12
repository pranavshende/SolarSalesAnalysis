const analyticsService = require('./analyticsService');

const generateInsights = async () => {
  const stateMetrics = await analyticsService.getStateMetrics();
  
  const insights = [];

  // Insight 1: Top 5 states to invest
  const topInvestmentStates = stateMetrics
    .sort((a, b) => (b.cagr * 0.6 + (b.totalCapacity / 1000) * 0.4) - (a.cagr * 0.6 + (a.totalCapacity / 1000) * 0.4))
    .slice(0, 5)
    .map(s => s.state);
  
  insights.push({
    title: "Top 5 Investment Hotspots",
    content: `Based on CAGR and existing infrastructure, the top states to invest in are: ${topInvestmentStates.join(', ')}.`,
    type: "positive"
  });

  // Insight 2: High Growth Region
  const fastestGrowing = stateMetrics.sort((a, b) => b.latestYoY - a.latestYoY)[0];
  if (fastestGrowing) {
    insights.push({
      title: "Growth Leader",
      content: `${fastestGrowing.state} is currently exhibiting the highest growth momentum with a YoY increase of ${fastestGrowing.latestYoY}%.`,
      type: "highlight"
    });
  }

  // Insight 3: Utilization efficiency
  const efficientState = stateMetrics.sort((a, b) => (b.totalRevenue / b.totalCapacity) - (a.totalRevenue / a.totalCapacity))[0];
  if (efficientState) {
    insights.push({
      title: "Revenue Efficiency Tip",
      content: `${efficientState.state} has the highest revenue-to-capacity efficiency. Consider analyzing their project mix for best practices.`,
      type: "info"
    });
  }

  return insights;
};

module.exports = { generateInsights };
