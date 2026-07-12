import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Wallet, 
  ArrowUpRight, 
  PieChart as PieIcon,
  CreditCard,
  Target,
  FileDown
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { analyticsAPI } from '../services/api';
import StatCard from '../components/StatCard';

const COLORS = ['#f97316', '#ea580c', '#c2410c', '#9a3412', '#7c2d12', '#431407'];

const RevenueDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await analyticsAPI.getSummary();
      setData(data);
    } catch (err) {
      console.error('Failed to fetch revenue data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadAudit = () => {
    if (!data) return;
    const headers = ['State', 'Capacity (kW)', 'Revenue (Cr)'];
    const rows = data.stateMetrics.map(s => [s.state, s.totalCapacity, s.totalRevenue]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `revenue_audit_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  const calculateAvgEfficiency = () => {
    if (!data?.totals?.capacity || !data?.totals?.revenue) return "₹0.0 Cr/MW";
    const mw = data.totals.capacity / 1000;
    const efficiency = data.totals.revenue / mw;
    return `₹${efficiency.toFixed(1)} Cr/MW`;
  };

  if (loading) return <div>Analyzing financials...</div>;

  const pieData = (data?.topPerformers || []).map(s => ({
    name: s.state,
    value: s.totalRevenue || 0
  }));

  const barData = (data?.stateMetrics || []).slice(0, 8).map(s => ({
    name: s.state,
    efficiency: s.totalCapacity > 0 ? parseFloat((s.totalRevenue / (s.totalCapacity / 1000)).toFixed(2)) : 0
  }));

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-1">Revenue Concentration</h1>
          <p className="text-dark-400">ROI insights and financial distribution across regions</p>
        </div>
        <button 
          onClick={handleDownloadAudit}
          className="flex items-center gap-2 px-6 py-3 bg-dark-900 border border-dark-800 rounded-2xl text-sm font-bold text-white hover:bg-dark-800 transition-all active:scale-95"
        >
          <FileDown className="w-4 h-4 text-solar" />
          Download Audit Log
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          label="Cumulative Revenue" 
          value={`₹${(data?.totals?.revenue || 0).toLocaleString(undefined, { minimumFractionDigits: 1 })} Cr`} 
          icon={Wallet} 
          trend={{ value: 14.2, isPositive: true }}
        />
        <StatCard 
          label="Avg Revenue Efficiency" 
          value={calculateAvgEfficiency()} 
          icon={Target} 
          trend={{ value: 5.4, isPositive: true }}
        />
        <StatCard 
          label="Highest Contributor" 
          value={data?.topPerformers[0]?.state} 
          icon={ArrowUpRight} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Distribution */}
        <div className="bg-dark-900 border border-dark-800 p-8 rounded-[2.5rem] shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-display font-bold text-white">Revenue by State</h3>
            <PieIcon className="w-5 h-5 text-dark-500" />
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '16px' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(val) => `₹${val.toLocaleString()} Cr`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {pieData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="text-xs text-dark-400 font-medium truncate">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Efficiency Chart */}
        <div className="bg-dark-900 border border-dark-800 p-8 rounded-[2.5rem] shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-display font-bold text-white">Revenue Efficiency (Cr/MW)</h3>
            <div className="px-3 py-1 bg-solar/10 rounded-lg text-[10px] font-black text-solar border border-solar/20">Benchmark: 3.8</div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} width={80} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '16px' }}
                  itemStyle={{ color: '#f97316' }}
                  cursor={{ fill: '#1e293b', opacity: 0.4 }}
                />
                <Bar dataKey="efficiency" fill="#f97316" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Transaction Summary */}
      <div className="bg-dark-900 border border-dark-800 rounded-[2.5rem] overflow-hidden shadow-xl">
        <div className="p-8 border-b border-dark-800 flex justify-between items-center">
          <h3 className="text-xl font-display font-bold text-white text-center">Top Project Estimates</h3>
          <span className="text-xs font-bold text-dark-500">Last Updated: 2 mins ago</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-dark-950/50">
                <th className="px-8 py-4 text-xs font-bold text-dark-500 uppercase tracking-widest">State</th>
                <th className="px-8 py-4 text-xs font-bold text-dark-500 uppercase tracking-widest">Est. ROI</th>
                <th className="px-8 py-4 text-xs font-bold text-dark-500 uppercase tracking-widest">Utility Revenue</th>
                <th className="px-8 py-4 text-xs font-bold text-dark-500 uppercase tracking-widest">Rooftop Revenue</th>
                <th className="px-8 py-4 text-xs font-bold text-dark-500 uppercase tracking-widest text-right">Total (Cr)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800">
              {data?.topPerformers.map((state, idx) => (
                <tr key={idx} className="hover:bg-dark-800/30 transition-colors">
                  <td className="px-8 py-4 font-bold text-white">{state.state}</td>
                  <td className="px-8 py-4">
                    <span className="px-2 py-1 bg-green-500/10 text-green-400 text-[10px] font-black rounded uppercase">
                      {(15 + Math.random() * 5).toFixed(1)}% ROI
                    </span>
                  </td>
                  <td className="px-8 py-4 text-sm text-dark-300">₹{(state.totalRevenue * 0.8).toFixed(1)} Cr</td>
                  <td className="px-8 py-4 text-sm text-dark-300">₹{(state.totalRevenue * 0.2).toFixed(1)} Cr</td>
                  <td className="px-8 py-4 text-sm font-bold text-solar text-right">₹{state.totalRevenue.toFixed(1)} Cr</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RevenueDashboard;
