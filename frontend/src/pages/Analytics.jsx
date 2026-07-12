import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart2, TrendingUp, Activity, MapPin, Info } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';

const Analytics = () => {
  const [data, setData] = useState([]);
  const [type, setType] = useState('state');
  const [metric, setMetric] = useState('cagr');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/analytics/detailed?type=${type}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        console.error("Failed to load analytics", err);
      }
      setLoading(false);
    };
    
    fetchData();
  }, [type]);

  const metricExplanations = {
    cagr: {
      title: "Compound Annual Growth Rate (CAGR)",
      description: "CAGR measures the smoothed annualized growth rate of solar capacity over the entire 10-year period (2014-2024). Unlike standard growth rates, CAGR eliminates volatility and peaks, giving a clear picture of long-term sustainable momentum. A high CAGR indicates consistent, long-term market expansion."
    },
    yoy: {
      title: "Year-over-Year (YoY) Momentum",
      description: "Latest YoY Growth measures the percentage change in capacity strictly between the last two recorded years. This acts as a short-term volatility indicator. A region might have a low 10-year CAGR but a massive YoY spike due to newly passed state policies or recent mega-park completions."
    },
    capacity: {
      title: "Cumulative Capacity Footprint",
      description: "This represents the absolute total sum of all solar infrastructure installed in the region. It highlights the market leaders by pure volume. While emerging states might have high growth rates (CAGR/YoY), established states will dominate the Capacity Footprint."
    }
  };

  // Sort data for charts to show top 15
  const getChartData = () => {
    let sorted = [...data];
    if (metric === 'cagr') sorted.sort((a, b) => b.cagr - a.cagr);
    if (metric === 'yoy') sorted.sort((a, b) => b.latestYoY - a.latestYoY);
    if (metric === 'capacity') sorted.sort((a, b) => b.totalCapacity - a.totalCapacity);
    return sorted.slice(0, 15);
  };

  const chartData = getChartData();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-900 border border-dark-800 p-4 rounded-xl shadow-xl">
          <p className="font-bold text-white mb-2">{label}</p>
          <p className="text-solar font-medium">
            {metric === 'capacity' ? `${payload[0].value.toFixed(2)} kW` : `${payload[0].value}%`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-1">Detailed Analytics</h1>
          <p className="text-dark-400">Deep-dive into performance metrics and mathematical models</p>
        </div>
        
        <div className="flex bg-dark-900 border border-dark-800 rounded-2xl p-1.5 shadow-xl">
           <button 
             onClick={() => setType('state')}
             className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${type === 'state' ? 'bg-solar text-white shadow-lg' : 'text-dark-400 hover:text-white'}`}
           >
             <MapPin className="w-4 h-4" />
             State-Wise
           </button>
           <button 
             onClick={() => setType('city')}
             className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${type === 'city' ? 'bg-solar text-white shadow-lg' : 'text-dark-400 hover:text-white'}`}
           >
             <Activity className="w-4 h-4" />
             City-Wise
           </button>
        </div>
      </div>

      {/* Analysis Selector and Explanation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:p-8">
        <div className="bg-dark-900 border border-dark-800 p-6 rounded-[2rem] shadow-xl flex flex-col justify-center">
          <label className="text-xs font-black text-dark-500 uppercase tracking-widest mb-3 block">Select Analysis Model</label>
          <select 
            value={metric}
            onChange={(e) => setMetric(e.target.value)}
            className="w-full bg-dark-950 border border-dark-800 text-white p-4 rounded-xl focus:outline-none focus:border-solar font-medium mb-6 appearance-none cursor-pointer"
          >
            <option value="cagr">Long-Term Growth (CAGR)</option>
            <option value="yoy">Short-Term Momentum (YoY)</option>
            <option value="capacity">Total Capacity Footprint</option>
          </select>

          <div className="bg-blue-500/10 border border-blue-500/20 p-5 rounded-2xl relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-10">
              <Info className="w-24 h-24 text-blue-500" />
            </div>
            <h3 className="text-blue-400 font-bold mb-2 relative z-10">{metricExplanations[metric].title}</h3>
            <p className="text-sm text-dark-300 leading-relaxed relative z-10">
              {metricExplanations[metric].description}
            </p>
          </div>
        </div>

        {/* Chart Area */}
        <div className="lg:col-span-2 bg-dark-900 border border-dark-800 p-4 md:p-8 rounded-[2rem] shadow-xl min-h-[300px] md:h-[400px]">
          <h3 className="text-lg font-bold text-white mb-6">Top 15 Regions by {metric === 'cagr' ? 'CAGR' : metric === 'yoy' ? 'YoY Growth' : 'Capacity'}</h3>
          {loading ? (
             <div className="flex items-center justify-center h-full">
               <div className="animate-spin w-8 h-8 border-4 border-solar border-t-transparent rounded-full"></div>
             </div>
          ) : chartData.length > 0 ? (
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 40 }}>
                  <XAxis 
                    dataKey="name" 
                    stroke="#4b5563" 
                    fontSize={10} 
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis 
                    stroke="#4b5563" 
                    fontSize={10} 
                    domain={metric === 'capacity' ? [0, 'auto'] : [0, dataMax => Math.max(dataMax, 10)]}
                    tickFormatter={(val) => metric === 'capacity' ? `${(val/1000).toFixed(0)}k` : `${val}%`} 
                  />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Bar dataKey={metric === 'capacity' ? 'totalCapacity' : metric === 'yoy' ? 'latestYoY' : 'cagr'} radius={[4, 4, 0, 0]} minPointSize={2}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={metric === 'capacity' ? '#3b82f6' : metric === 'yoy' ? '#facc15' : '#10b981'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-dark-500 font-medium">No data available</div>
          )}
        </div>
      </div>

      <div className="bg-dark-900 border border-dark-800 p-4 md:p-8 rounded-[2.5rem] shadow-2xl">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-8 h-8 border-4 border-solar border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-dark-800">
                  <th className="py-4 px-4 text-xs font-black text-dark-500 uppercase tracking-widest">{type === 'city' ? 'City / Park' : 'State'}</th>
                  {type === 'city' && <th className="py-4 px-4 text-xs font-black text-dark-500 uppercase tracking-widest">State</th>}
                  <th className="py-4 px-4 text-xs font-black text-dark-500 uppercase tracking-widest text-right">Total Capacity</th>
                  <th className="py-4 px-4 text-xs font-black text-dark-500 uppercase tracking-widest text-right">CAGR (10Y)</th>
                  <th className="py-4 px-4 text-xs font-black text-dark-500 uppercase tracking-widest text-right">Latest YoY</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, idx) => (
                  <tr key={idx} className="border-b border-dark-800/50 hover:bg-dark-800/20 transition-colors">
                    <td className="py-4 px-4 font-bold text-white">
                      {item.name}
                    </td>
                    {type === 'city' && (
                      <td className="py-4 px-4 text-sm font-medium text-dark-400">
                        {item.state}
                      </td>
                    )}
                    <td className="py-4 px-4 text-right">
                      <span className="bg-dark-950 px-3 py-1 rounded-lg text-sm font-bold text-white border border-dark-800">
                        {item.totalCapacity.toFixed(2)} kW
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className={`flex items-center justify-end gap-1 ${item.cagr >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        <TrendingUp className="w-4 h-4" />
                        <span className="font-bold">{item.cagr}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className={`flex items-center justify-end gap-1 ${item.latestYoY >= 0 ? 'text-solar' : 'text-red-400'}`}>
                        <BarChart2 className="w-4 h-4" />
                        <span className="font-bold">{item.latestYoY}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {data.length === 0 && (
              <div className="text-center py-12 text-dark-500 font-medium">
                No analytics data available for this selection.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
