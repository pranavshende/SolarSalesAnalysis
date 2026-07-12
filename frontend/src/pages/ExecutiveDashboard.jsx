import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Zap, 
  ArrowUpRight,
  Download,
  Calendar,
  Leaf,
  Globe,
  Trophy,
  ShieldCheck
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import StatCard from '../components/StatCard';
import { analyticsAPI } from '../services/api';

const ExecutiveDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('capacity'); // 'capacity' or 'revenue'

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await analyticsAPI.getSummary();
      setData(data);
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[calc(100vh-200px)]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-solar"></div>
    </div>
  );

  const totalRevenueValue = data?.totals?.revenue || 0;
  const totalCapacityValue = data?.totals?.capacity || 0;

  const totalRevenue = totalRevenueValue.toLocaleString(undefined, { minimumFractionDigits: 2 });
  const totalCapacity = totalCapacityValue.toLocaleString();
    
  const topState = data?.topPerformers?.[0]?.state || 'N/A';

  // Feature 2: Carbon Offset Calculations
  const co2Saved = (totalCapacityValue * 0.00084).toFixed(1); // Avg 0.84kg per kWh, roughly simplified
  const treesEquivalent = Math.floor(totalCapacityValue / 50); // Roughly 1 tree per 50kW capacity per year

  // Dynamic CAGR calculation
  const calculateCAGR = () => {
    if (!data?.summary || data.summary.length < 2) return "0.0%";
    const first = data.summary[0];
    const last = data.summary[data.summary.length - 1];
    const periods = last.year - first.year;
    if (periods <= 0) return "0.0%";
    const cagr = (Math.pow(last.capacity / first.capacity, 1 / periods) - 1) * 100;
    return `${cagr.toFixed(1)}%`;
  };

  const handleExport = () => {
    if (!data) return;
    const headers = ['Year', 'Capacity (kW)', 'Revenue (Cr)'];
    const rows = data.summary.map(s => [s.year, s.capacity, s.revenue]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `solar_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-1">Executive Overview</h1>
          <p className="text-dark-400">Real-time solar installation & revenue metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            className="flex items-center gap-2 px-4 py-2.5 bg-dark-900 border border-dark-800 rounded-xl text-sm font-medium hover:bg-dark-800 transition-all active:scale-95"
          >
            <Calendar className="w-4 h-4 text-solar" />
            <span>Last 10 Years</span>
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 bg-solar text-white rounded-xl text-sm font-bold hover:bg-solar-600 transition-all shadow-lg shadow-solar-500/20 active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Revenue" 
          value={`₹${totalRevenue} Cr`} 
          icon={DollarSign} 
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatCard 
          label="Total Capacity" 
          value={`${totalCapacity} kW`} 
          icon={Zap} 
          trend={{ value: 8.2, isPositive: true }}
        />
        <StatCard 
          label="Top State" 
          value={topState} 
          icon={Trophy} 
        />
        <StatCard 
          label="Avg Growth (CAGR)" 
          value={calculateCAGR()} 
          icon={TrendingUp} 
          trend={{ value: 2.1, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Trend Analysis */}
        <div className="lg:col-span-8 bg-dark-900 border border-dark-800 p-8 rounded-[2rem] shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-display font-bold text-white">
              {activeTab === 'capacity' ? 'Capacity Growth Trend' : 'Revenue Performance Trend'}
            </h3>
            <div className="bg-dark-950 p-1 rounded-lg border border-dark-800 flex gap-1">
              <button 
                onClick={() => setActiveTab('capacity')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${activeTab === 'capacity' ? 'bg-dark-800 text-solar' : 'text-dark-500 hover:text-dark-300'}`}
              >
                Capacity
              </button>
              <button 
                onClick={() => setActiveTab('revenue')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${activeTab === 'revenue' ? 'bg-dark-800 text-solar' : 'text-dark-500 hover:text-dark-300'}`}
              >
                Revenue
              </button>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.summary || []}>
                <defs>
                  <linearGradient id="colorCapacity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis 
                  dataKey="year" 
                  stroke="#64748b" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={10}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(val) => activeTab === 'capacity' ? `${val/1000}k` : `₹${val}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '16px' }}
                  itemStyle={{ color: activeTab === 'capacity' ? '#f97316' : '#10b981' }}
                  formatter={(val) => activeTab === 'capacity' ? [`${val.toLocaleString()} kW`, 'Capacity'] : [`₹${val.toLocaleString()} Cr`, 'Revenue']}
                />
                <Area 
                  type="monotone" 
                  dataKey={activeTab} 
                  stroke={activeTab === 'capacity' ? "#f97316" : "#10b981"} 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill={`url(#color${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)})`} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Feature 2: Carbon Offset Tracker */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-gradient-to-br from-green-600 to-green-900 border border-green-500/30 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
            <Leaf className="absolute -top-10 -right-10 w-40 h-40 opacity-10 rotate-12 group-hover:scale-110 transition-transform" />
            <div className="relative z-10">
              <h3 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Sustainability Impact
              </h3>
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-black text-green-200 mb-1">CO2 Footprint Reduced</p>
                  <p className="text-3xl font-display font-bold text-white">{co2Saved} <span className="text-sm font-normal opacity-70">Tons</span></p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-black text-green-200 mb-1">Environmental Equivalent</p>
                  <p className="text-3xl font-display font-bold text-white">{treesEquivalent.toLocaleString()} <span className="text-sm font-normal opacity-70">Trees Planted</span></p>
                </div>
                <div className="pt-4 border-t border-green-500/30">
                  <div className="flex justify-between items-center text-xs font-bold text-white mb-2">
                    <span>Net-Zero Progress</span>
                    <span>84%</span>
                  </div>
                  <div className="h-1.5 w-full bg-green-950/50 rounded-full overflow-hidden">
                    <div className="h-full bg-white w-[84%] rounded-full shadow-[0_0_10px_white]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 5: Competitive Benchmarking */}
          <div className="bg-dark-900 border border-dark-800 p-8 rounded-[2.5rem] shadow-xl">
             <h3 className="text-lg font-display font-bold text-white mb-6 flex items-center gap-2">
               <ShieldCheck className="w-5 h-5 text-solar" />
               National Benchmark
             </h3>
             <div className="space-y-4">
               <div className="p-4 bg-dark-950 rounded-2xl border border-dark-800">
                 <div className="flex justify-between items-center mb-1">
                   <span className="text-xs text-dark-500 font-bold uppercase">Efficiency Rank</span>
                   <span className="text-solar text-xs font-bold">#4 National</span>
                 </div>
                 <p className="text-lg font-bold text-white">Top 5% Performer</p>
               </div>
               <div className="p-4 bg-dark-950 rounded-2xl border border-dark-800">
                 <div className="flex justify-between items-center mb-1">
                   <span className="text-xs text-dark-500 font-bold uppercase">Market Share</span>
                   <span className="text-blue-400 text-xs font-bold">12.4% Global</span>
                 </div>
                 <p className="text-lg font-bold text-white">Aggressive Expansion</p>
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* Top States */}
      <div className="bg-dark-900 border border-dark-800 p-8 rounded-[2.5rem] shadow-xl">
        <h3 className="text-xl font-display font-bold text-white mb-8">Regional Market Concentration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data?.topPerformers.map((state, idx) => (
            <div key={state.state} className="group cursor-pointer p-4 hover:bg-dark-950 rounded-2xl transition-all border border-transparent hover:border-dark-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-dark-950 border border-dark-800 flex items-center justify-center text-[10px] text-solar font-black group-hover:bg-solar group-hover:text-white transition-all">
                    {idx + 1}
                  </span>
                  {state.state}
                </span>
                <span className="text-xs font-black text-dark-500">
                  {((state.totalCapacity / totalCapacityValue) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="h-2 w-full bg-dark-950 rounded-full overflow-hidden border border-dark-800">
                <div 
                  className="h-full bg-solar rounded-full transition-all duration-1000"
                  style={{ width: `${(state.totalCapacity / data.topPerformers[0].totalCapacity) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExecutiveDashboard;
