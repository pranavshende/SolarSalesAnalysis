import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Rocket, 
  TrendingUp, 
  AlertTriangle, 
  Search, 
  ArrowRight,
  Target,
  Zap,
  BarChart2,
  Star,
  CloudRain,
  Sun,
  Wind,
  ThermometerSun,
  ShieldCheck,
  Award
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  Legend
} from 'recharts';
import { analyticsAPI } from '../services/api';

const SalesIntelligence = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchGrowthMetrics();
  }, []);

  const fetchGrowthMetrics = async () => {
    try {
      const { data } = await analyticsAPI.getGrowth();
      setData(data);
    } catch (err) {
      console.error('Failed to fetch growth metrics', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Analyzing market data...</div>;

  const filteredData = data.filter(s => s.state.toLowerCase().includes(searchTerm.toLowerCase()));
  const opportunityZones = filteredData.filter(s => s.growthMomentum > 20 && s.demandIndex < 70).slice(0, 3);
  const topperformers = [...filteredData].sort((a, b) => b.growthMomentum - a.growthMomentum).slice(0, 6);

  // Feature 7: Smart Lead Prioritization Scoring
  const hotLeads = [...filteredData]
    .map(state => ({
      ...state,
      leadScore: (state.growthMomentum * 0.6 + (100 - state.demandIndex) * 0.4).toFixed(1)
    }))
    .sort((a, b) => b.leadScore - a.leadScore)
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-1">Sales Intelligence</h1>
          <p className="text-dark-400">High-growth opportunity zones and performance momentum</p>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
          <input 
            type="text" 
            placeholder="Search market..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-dark-900 border border-dark-800 rounded-xl py-2.5 pl-11 pr-4 text-sm text-white focus:border-solar transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-8">
          {/* Opportunity Zones */}
          <div className="bg-dark-900 border border-dark-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 bg-solar/5 w-40 h-40 rounded-full blur-3xl"></div>
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-solar/10 p-3 rounded-2xl border border-solar/20">
                <Target className="w-6 h-6 text-solar" />
              </div>
              <h3 className="text-xl font-display font-bold text-white">Targeted Opportunity Zones</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {opportunityZones.map((zone, idx) => (
                <div key={idx} className="bg-dark-950 border border-dark-800 p-6 rounded-[2rem] hover:border-solar/40 transition-all group">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black text-solar uppercase tracking-widest bg-solar/10 px-2 py-0.5 rounded">High Growth</span>
                    <Rocket className="w-4 h-4 text-dark-500 group-hover:text-solar transition-colors" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-1">{zone.state}</h4>
                  <div className="flex items-end gap-2 mb-4">
                    <span className="text-2xl font-display font-bold text-white">+{zone.growthMomentum.toFixed(1)}%</span>
                    <span className="text-xs text-dark-500 mb-1">YoY</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-[10px] text-dark-500 font-bold uppercase tracking-tight">
                      <span>Demand Index</span>
                      <span>{zone.demandIndex}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-dark-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-solar rounded-full shadow-[0_0_8px_rgba(249,115,22,0.5)]"
                        style={{ width: `${zone.demandIndex}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feature 7: Hot Leads Scoring Table */}
          <div className="bg-dark-900 border border-dark-800 rounded-[2.5rem] p-8 shadow-xl">
             <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-3">
                 <div className="bg-orange-500/10 p-3 rounded-2xl border border-orange-500/20">
                   <ShieldCheck className="w-6 h-6 text-orange-400" />
                 </div>
                 <h3 className="text-xl font-display font-bold text-white">Smart Lead Prioritization</h3>
               </div>
               <span className="text-[10px] font-black text-dark-500 uppercase tracking-widest">AI Scoring Active</span>
             </div>
             
             <div className="overflow-hidden rounded-2xl border border-dark-800">
               <table className="w-full text-left text-sm">
                 <thead>
                   <tr className="bg-dark-950/50">
                     <th className="px-6 py-4 text-dark-500 font-black uppercase tracking-widest text-[10px]">Territory</th>
                     <th className="px-6 py-4 text-dark-500 font-black uppercase tracking-widest text-[10px]">Growth</th>
                     <th className="px-6 py-4 text-dark-500 font-black uppercase tracking-widest text-[10px]">Market Gap</th>
                     <th className="px-6 py-4 text-dark-500 font-black uppercase tracking-widest text-[10px]">Lead Score</th>
                     <th className="px-6 py-4 text-right"></th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-dark-800">
                   {hotLeads.map((lead, idx) => (
                     <tr key={idx} className="hover:bg-dark-950 transition-colors">
                       <td className="px-6 py-4 font-bold text-white">{lead.state}</td>
                       <td className="px-6 py-4 text-green-400 font-medium">+{lead.growthMomentum.toFixed(1)}%</td>
                       <td className="px-6 py-4 text-dark-400">{100 - lead.demandIndex}%</td>
                       <td className="px-6 py-4">
                         <div className="flex items-center gap-2">
                           <span className={`px-3 py-1 rounded-full text-[10px] font-black ${idx < 2 ? 'bg-solar text-white' : 'bg-dark-800 text-dark-400'}`}>
                             {lead.leadScore}
                           </span>
                         </div>
                       </td>
                       <td className="px-6 py-4 text-right">
                         <button className="text-dark-500 hover:text-solar transition-colors">
                           <ArrowRight className="w-4 h-4" />
                         </button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        </div>

        {/* Intelligence Side Feed */}
        <div className="lg:col-span-4 space-y-8">
          {/* Feature 3: Weather-Impact Insights */}
          <div className="bg-gradient-to-br from-dark-900 to-dark-950 border border-dark-800 rounded-[2.5rem] p-8 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
                <CloudRain className="w-5 h-5 text-blue-400" />
                Weather Intel
              </h3>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-green-500/40"></div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-dark-900 border border-dark-800 rounded-2xl">
                <div className="bg-solar/10 p-3 rounded-xl">
                  <Sun className="w-6 h-6 text-solar" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-dark-500 uppercase">Irradiance Peak</p>
                  <p className="text-sm font-bold text-white">Rajasthan, Gujarat</p>
                  <p className="text-[10px] text-green-400 font-bold">+12% Yield Potential</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-dark-900 border border-dark-800 rounded-2xl">
                <div className="bg-blue-500/10 p-3 rounded-xl">
                  <Wind className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-dark-500 uppercase">Dust Storm Warning</p>
                  <p className="text-sm font-bold text-white">Thar Region</p>
                  <p className="text-[10px] text-red-400 font-bold">Maintenance Surge Expected</p>
                </div>
              </div>

              <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <ThermometerSun className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold text-white">Production Forecast</span>
                </div>
                <p className="text-[10px] text-dark-400 leading-relaxed">
                  Optimal thermal conditions in Northern belts will increase inverter efficiency by 4.2% over the next 72 hours.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-dark-900 border border-dark-800 rounded-[2.5rem] p-8 shadow-xl flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-solar" />
                AI Market Alerts
              </h3>
            </div>

            <div className="space-y-6">
              <div className="p-5 bg-solar/5 border border-solar/20 rounded-2xl hover:bg-solar/10 transition-colors group cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <AlertTriangle className="w-5 h-5 text-solar" />
                  <span className="text-xs font-bold text-solar uppercase tracking-widest">Growth Surge</span>
                </div>
                <p className="text-sm text-white font-medium mb-1">Rajasthan Activity Spike</p>
                <p className="text-xs text-dark-500 leading-relaxed group-hover:text-dark-300 transition-colors">
                  New capacity additions in Bhadla region have increased YoY momentum by 24.5%.
                </p>
              </div>

              <div className="p-5 bg-dark-950/50 border border-dark-800 rounded-2xl hover:border-dark-700 transition-all cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <Zap className="w-5 h-5 text-blue-400" />
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Efficiency Alert</span>
                </div>
                <p className="text-sm text-white font-medium mb-1">Gujarat Revenue Efficiency</p>
                <p className="text-xs text-dark-500 leading-relaxed">
                  Parks in Gujarat showing 15% higher revenue efficiency per kW.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-dark-800">
              <div 
                onClick={() => navigate('/geo')}
                className="flex items-center justify-between p-4 bg-solar rounded-2xl text-white shadow-lg shadow-solar-500/20 cursor-pointer active:scale-95 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <Star className="w-5 h-5 fill-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold opacity-80 uppercase tracking-tighter">Premium Insight</p>
                    <p className="text-sm font-black">Regional Expansion</p>
                  </div>
                </div>
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesIntelligence;
