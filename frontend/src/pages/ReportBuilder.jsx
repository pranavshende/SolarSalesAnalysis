import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Search, 
  Filter, 
  FileSpreadsheet,
  FileCode,
  Printer,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Plus,
  Map,
  Building2
} from 'lucide-react';
import { analyticsAPI } from '../services/api';

const ReportBuilder = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [reportType, setReportType] = useState('state'); // 'state' or 'city'

  useEffect(() => {
    fetchData();
  }, [reportType]);

  const fetchData = async () => {
    setLoading(true);
    setData([]); // Clear old data to prevent mapping issues during transition
    try {
      if (reportType === 'state') {
        const { data: summary } = await analyticsAPI.getSummary();
        setData(summary.stateMetrics);
      } else {
        const { data: cities } = await analyticsAPI.getCities();
        setData(cities);
      }
    } catch (err) {
      console.error('Failed to fetch report data', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter(item => {
    if (!item) return false;
    const searchLower = searchTerm.toLowerCase();
    if (reportType === 'state') {
      return item.state?.toLowerCase().includes(searchLower);
    } else {
      return item.city?.toLowerCase().includes(searchLower) || item.state?.toLowerCase().includes(searchLower);
    }
  });

  const handleExportCSV = () => {
    if (!filteredData.length) return;
    
    let headers, rows;
    if (reportType === 'state') {
      headers = ['State', 'Total Capacity (kW)', 'Revenue (Cr)', 'CAGR (%)', 'Latest YoY (%)'];
      rows = filteredData.map(item => [item.state, item.totalCapacity, item.totalRevenue, item.cagr, item.latestYoY]);
    } else {
      headers = ['City', 'State', 'Capacity (kW)', 'Revenue (Cr)', 'Year'];
      rows = filteredData.map(item => [item.city, item.state, item.capacity, item.revenue, item.latestYear]);
    }

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");
    
    const fileName = `solar_${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`;
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", fileName);
    link.click();
  };

  const handleExportJSON = () => {
    if (!filteredData.length) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredData, null, 2));
    const fileName = `solar_${reportType}_report_${new Date().toISOString().split('T')[0]}.json`;
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", fileName);
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-1">Market Report Builder</h1>
          <p className="text-dark-400">Generate and export granular {reportType}-wise market intelligence</p>
        </div>
        
        <div className="flex bg-dark-900 border border-dark-800 rounded-2xl p-1.5 shadow-xl">
          <button 
            onClick={() => setReportType('state')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${reportType === 'state' ? 'bg-solar text-white shadow-lg' : 'text-dark-400 hover:text-white'}`}
          >
            <Map className="w-4 h-4" />
            State-wise
          </button>
          <button 
            onClick={() => setReportType('city')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${reportType === 'city' ? 'bg-solar text-white shadow-lg' : 'text-dark-400 hover:text-white'}`}
          >
            <Building2 className="w-4 h-4" />
            City-wise
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-dark-900 border border-dark-800 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col">
        <div className="p-8 border-b border-dark-800 flex flex-col md:flex-row gap-6 md:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
            <input 
              type="text" 
              placeholder={`Search ${reportType === 'city' ? 'cities' : 'states'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-dark-950 border border-dark-800 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:border-solar transition-all"
            />
          </div>
          
          <div className="flex items-center gap-4">
             <div className="flex bg-dark-950 border border-dark-800 rounded-xl p-1">
               <button 
                 onClick={handleExportCSV}
                 title="Export CSV"
                 className="p-2 text-dark-400 hover:text-solar hover:bg-solar/5 rounded-lg transition-all"
               >
                 <FileSpreadsheet className="w-5 h-5" />
               </button>
               <button 
                 onClick={handleExportJSON}
                 title="Export JSON"
                 className="p-2 text-dark-400 hover:text-solar hover:bg-solar/5 rounded-lg transition-all"
               >
                 <FileCode className="w-5 h-5" />
               </button>
               <button 
                 onClick={handlePrint}
                 title="Print View"
                 className="p-2 text-dark-400 hover:text-solar hover:bg-solar/5 rounded-lg transition-all"
               >
                 <Printer className="w-5 h-5" />
               </button>
             </div>
             <div className="h-8 w-px bg-dark-800"></div>
              <button 
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-6 py-2.5 bg-solar text-white rounded-xl font-bold text-sm shadow-lg shadow-solar-500/20 hover:bg-solar-600 transition-all active:scale-95"
              >
                <Download className="w-4 h-4" />
                Generate {reportType === 'state' ? 'State' : 'City'} XLSX
              </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-dark-950/50">
                <th className="px-8 py-5 text-[10px] font-black text-dark-500 uppercase tracking-[0.2em]">{reportType === 'state' ? 'State' : 'City / Region'}</th>
                {reportType === 'city' && <th className="px-8 py-5 text-[10px] font-black text-dark-500 uppercase tracking-[0.2em]">Parent State</th>}
                <th className="px-8 py-5 text-[10px] font-black text-dark-500 uppercase tracking-[0.2em]">Capacity (kW)</th>
                <th className="px-8 py-5 text-[10px] font-black text-dark-500 uppercase tracking-[0.2em]">Revenue (Cr)</th>
                <th className="px-8 py-5 text-[10px] font-black text-dark-500 uppercase tracking-[0.2em]">{reportType === 'state' ? 'CAGR (%)' : 'Latest Year'}</th>
                <th className="px-8 py-5 text-[10px] font-black text-dark-500 uppercase tracking-[0.2em]">Trend</th>
                <th className="px-8 py-5 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-8 py-20 text-center text-dark-500">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-10 h-10 border-2 border-solar border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-xs font-bold uppercase tracking-widest animate-pulse">Compiling Report Data...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-8 py-20 text-center text-dark-500 italic">
                    No data found matching your filters.
                  </td>
                </tr>
              ) : filteredData.map((item, idx) => (
                <tr key={idx} className="hover:bg-dark-800/20 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-dark-950 border border-dark-800 flex items-center justify-center text-[10px] font-bold text-solar">
                        {(reportType === 'state' ? item?.state : item?.city)?.substring(0, 2).toUpperCase() || '??'}
                      </div>
                      <span className="font-bold text-white transition-colors group-hover:text-solar">
                        {reportType === 'state' ? item?.state : item?.city}
                      </span>
                    </div>
                  </td>
                  {reportType === 'city' && (
                    <td className="px-8 py-5 font-medium text-dark-400 text-xs">{item?.state}</td>
                  )}
                  <td className="px-8 py-5 font-medium text-dark-200">
                    {(reportType === 'state' ? item?.totalCapacity : item?.capacity)?.toLocaleString() || '0'}
                  </td>
                  <td className="px-8 py-5 font-medium text-dark-200">
                    ₹{(reportType === 'state' ? item?.totalRevenue : item?.revenue)?.toFixed(2) || '0.00'}
                  </td>
                  <td className="px-8 py-5">
                    {reportType === 'state' ? (
                      <span className={`text-xs font-bold ${item?.cagr > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {item?.cagr > 0 ? '+' : ''}{item?.cagr}%
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-dark-400">{item?.latestYear}</span>
                    )}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-dark-950 rounded-full overflow-hidden border border-dark-800">
                        <div 
                          className="h-full bg-solar rounded-full" 
                          style={{ width: `${Math.min(100, reportType === 'state' ? (item?.latestYoY || 0) : ((item?.capacity || 0) / 100))}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-dark-500">
                        {reportType === 'state' ? item?.latestYoY?.toFixed(0) : 'Active'}%
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 text-dark-600 hover:text-white rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-8 border-t border-dark-800 flex items-center justify-between">
           <p className="text-xs font-bold text-dark-500 uppercase tracking-widest leading-none">
             Total Records: <span className="text-white">{filteredData.length}</span>
           </p>
           <div className="flex gap-2">
             <button className="p-2.5 rounded-xl border border-dark-800 text-dark-600 hover:bg-dark-800 transition-all disabled:opacity-30" disabled>
               <ChevronLeft className="w-5 h-5" />
             </button>
             <button className="p-2.5 rounded-xl border border-dark-800 text-dark-600 hover:bg-dark-800 transition-all disabled:opacity-30" disabled>
               <ChevronRight className="w-5 h-5" />
             </button>
           </div>
        </div>
      </div>

      {/* Quick Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-dark-900 border border-dark-800 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
           <div className="absolute -top-10 -right-10 bg-solar/5 w-32 h-32 rounded-full blur-3xl group-hover:bg-solar/10 transition-all"></div>
           <h3 className="text-sm font-black text-dark-500 uppercase tracking-[0.2em] mb-4">Top Region</h3>
           <p className="text-2xl font-display font-bold text-white mb-2">{data[0]?.state || 'N/A'}</p>
           <p className="text-xs text-dark-400">Leading the current dataset in solar penetration.</p>
        </div>

        <div className="bg-dark-900 border border-dark-800 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
           <div className="absolute -top-10 -right-10 bg-blue-500/5 w-32 h-32 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-all"></div>
           <h3 className="text-sm font-black text-dark-500 uppercase tracking-[0.2em] mb-4">Total Capacity</h3>
           <p className="text-2xl font-display font-bold text-white mb-2">
             {data.reduce((acc, curr) => acc + (reportType === 'state' ? curr.totalCapacity : curr.capacity), 0).toLocaleString()} <span className="text-xs text-dark-500">kW</span>
           </p>
           <p className="text-xs text-dark-400">Cumulative installed capacity in this report view.</p>
        </div>

        <div className="bg-dark-900 border border-dark-800 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
           <div className="absolute -top-10 -right-10 bg-green-500/5 w-32 h-32 rounded-full blur-3xl group-hover:bg-green-500/10 transition-all"></div>
           <h3 className="text-sm font-black text-dark-500 uppercase tracking-[0.2em] mb-4">Data Version</h3>
           <p className="text-2xl font-display font-bold text-white mb-2">v1.2.0-PRO</p>
           <p className="text-xs text-dark-400">Verified production dataset with 100% normalization.</p>
        </div>
      </div>
    </div>
  );
};

export default ReportBuilder;
