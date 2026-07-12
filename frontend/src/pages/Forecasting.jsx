import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  BrainCircuit, 
  Zap, 
  Settings, 
  RefreshCcw,
  BarChart3,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { 
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { analyticsAPI } from '../services/api';

const Forecasting = () => {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState(['All']);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStates();
  }, []);

  const fetchStates = async () => {
    try {
      const { data: summaryData } = await analyticsAPI.getSummary();
      const stateList = summaryData.stateMetrics.map(s => s.state);
      setStates(stateList);
      if (stateList.length > 0) {
        setSelectedState(stateList[0]);
        fetchCities(stateList[0]);
        handleForecast(stateList[0], 'All');
      }
    } catch (err) {
      console.error('Failed to fetch states', err);
    }
  };

  const fetchCities = async (state) => {
    try {
      const { data: cityData } = await analyticsAPI.getCities(state);
      const cityList = ['All', ...cityData.map(c => c.city)];
      setCities(cityList);
    } catch (err) {
      console.error('Failed to fetch cities', err);
    }
  };

  const handleForecast = async (state, city) => {
    setData(null);
    setLoading(true);
    try {
      const { data: forecastData } = await analyticsAPI.getForecast(state, city);
      
      const chartData = [
        ...forecastData.historical.map(h => ({
          year: h.year,
          actual: h.capacity,
          type: 'Historical'
        })),
        ...forecastData.forecast.map(f => ({
          year: f.year,
          predicted: f.predicted_capacity,
          low: f.confidence_interval_low,
          high: f.confidence_interval_high,
          type: 'Forecast'
        }))
      ];
      
      setData({ ...forecastData, chartData });
    } catch (err) {
      console.error('Forecast failed', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2 flex items-center gap-3">
            AI Demand Forecasting
            <div className="bg-solar/10 px-2 py-0.5 rounded text-[10px] font-black uppercase text-solar border border-solar/20">Alpha</div>
          </h1>
          <p className="text-dark-400">ML-driven capacity predictions for {selectedCity === 'All' ? selectedState : selectedCity}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <select 
              value={selectedState}
              onChange={(e) => {
                const newState = e.target.value;
                setSelectedState(newState);
                setSelectedCity('All');
                fetchCities(newState);
                handleForecast(newState, 'All');
              }}
              className="bg-dark-900 border border-dark-800 rounded-xl py-2.5 pl-4 pr-10 text-sm text-white appearance-none focus:border-solar transition-all"
            >
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <Settings className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500 pointer-events-none" />
          </div>

          <div className="relative">
            <select 
              value={selectedCity}
              onChange={(e) => {
                const newCity = e.target.value;
                setSelectedCity(newCity);
                handleForecast(selectedState, newCity);
              }}
              className="bg-dark-900 border border-dark-800 rounded-xl py-2.5 pl-4 pr-10 text-sm text-white appearance-none focus:border-solar transition-all min-w-[150px]"
            >
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <BarChart3 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500 pointer-events-none" />
          </div>

          <button 
            onClick={() => handleForecast(selectedState, selectedCity)}
            className="p-2.5 bg-dark-900 border border-dark-800 rounded-xl hover:bg-dark-800 transition-all text-solar"
          >
            <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-3 bg-dark-900 border border-dark-800 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8">
             <div className="flex items-center gap-2 px-4 py-2 bg-dark-950/50 backdrop-blur-md rounded-2xl border border-dark-800">
               <BrainCircuit className="w-4 h-4 text-solar" />
               <span className="text-xs font-bold text-dark-300">Model: <span className="text-solar">{data?.modelUsed || 'Computing...'}</span></span>
             </div>
          </div>

          <div className="flex items-center gap-4 mb-10">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-solar"></div>
              <span className="text-xs font-bold text-dark-400">Actual Capacity</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-dark-500 border border-solar border-dashed"></div>
              <span className="text-xs font-bold text-dark-400">Forecast</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-1.5 rounded-sm bg-solar/10"></div>
              <span className="text-xs font-bold text-dark-400">95% Confidence Interval</span>
            </div>
          </div>

          <div className="h-[450px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data?.chartData || []}>
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
                  tickFormatter={(val) => `${(val/1000).toFixed(1)} MW`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '16px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="high" 
                  stroke="none" 
                  fill="#f97316" 
                  fillOpacity={0.05} 
                />
                <Area 
                  type="monotone" 
                  dataKey="low" 
                  stroke="none" 
                  fill="#000" 
                  fillOpacity={0.2} 
                />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#f97316" 
                  strokeWidth={4} 
                  dot={{ r: 4, fill: '#f97316', strokeWidth: 2, stroke: '#0f172a' }} 
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="predicted" 
                  stroke="#f97316" 
                  strokeWidth={2} 
                  strokeDasharray="5 5"
                  dot={{ r: 3, fill: '#1e293b', strokeWidth: 1, stroke: '#f97316' }} 
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Insight Cards */}
        <div className="space-y-6">
          <div className="bg-dark-900 border border-dark-800 p-6 rounded-[2rem] shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-solar/10 p-2.5 rounded-xl">
                <Zap className="w-5 h-5 text-solar" />
              </div>
              <h3 className="font-display font-bold text-white">2030 Goal</h3>
            </div>
            <div className="space-y-1 mb-6">
              <p className="text-dark-500 text-xs font-bold uppercase tracking-wider">Projected Capacity</p>
              <h4 className="text-3xl font-display font-bold text-white">
                {data?.forecast[data.forecast.length - 1].predicted_capacity.toLocaleString(undefined, { maximumFractionDigits: 0 })} <span className="text-xs text-dark-500">kW</span>
              </h4>
            </div>
            <div className="p-4 bg-dark-950/50 rounded-2xl border border-dark-800">
               <div className="flex items-center justify-between text-xs font-bold mb-2">
                 <span className="text-dark-400">Target Attainment</span>
                 <span className="text-solar">68%</span>
               </div>
               <div className="h-1.5 w-full bg-dark-800 rounded-full overflow-hidden">
                 <div className="h-full bg-solar w-[68%] rounded-full shadow-[0_0_8px_rgba(249,115,22,0.4)]"></div>
               </div>
            </div>
          </div>

          <div className="bg-dark-900 border border-dark-800 p-6 rounded-[2rem] shadow-xl">
             <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-5 h-5 text-dark-400" />
                <h3 className="font-display font-bold text-white">Model Confidence</h3>
             </div>
             <p className="text-xs text-dark-400 leading-relaxed mb-6">
               The current projection uses <strong>{data?.modelUsed}</strong> based on historical trends. High variance detected in early periods may affect interval width.
             </p>
             <div className="flex items-center gap-4 text-xs font-bold">
                <div className="flex flex-col">
                  <span className="text-dark-500 uppercase tracking-tighter mb-1">Lower Bound</span>
                  <span className="text-white">{(data?.forecast[data.forecast.length-1].confidence_interval_low / 1000).toFixed(1)} MW</span>
                </div>
                <div className="h-8 w-px bg-dark-800"></div>
                <div className="flex flex-col">
                  <span className="text-dark-500 uppercase tracking-tighter mb-1">Upper Bound</span>
                  <span className="text-white">{(data?.forecast[data.forecast.length-1].confidence_interval_high / 1000).toFixed(1)} MW</span>
                </div>
             </div>
          </div>

          <div className="bg-solar rounded-[2rem] p-6 text-white shadow-xl shadow-solar-500/10">
             <h3 className="font-display font-bold mb-2">Strategy Tip</h3>
             <p className="text-xs opacity-90 leading-relaxed mb-6">
               Growth in {selectedCity === 'All' ? selectedState : selectedCity} is stabilizing. Focus sales efforts on utility-scale replacements to maintain momentum against projected trends.
             </p>
             <button 
               onClick={() => alert("Policy simulation engine is currently running on the ML backplane. Full sandbox interface coming in v1.1.")}
               className="w-full py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl text-xs font-bold transition-all active:scale-95"
             >
               View Policy Simulation
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forecasting;
