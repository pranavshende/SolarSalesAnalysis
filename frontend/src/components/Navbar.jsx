import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Terminal, 
  Settings, 
  RefreshCw, 
  CheckCircle2, 
  XCircle,
  ChevronDown,
  Cpu,
  Menu
} from 'lucide-react';
import { authAPI, analyticsAPI } from '../services/api';

const Navbar = ({ toggleMobileMenu }) => {
  const [backendStatus, setBackendStatus] = useState('checking');
  const [mlStatus, setMlStatus] = useState('checking');
  const [showDebug, setShowDebug] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const checkHealth = async () => {
    setIsRefreshing(true);
    
    // Check Backend
    try {
      await authAPI.checkHealth();
      setBackendStatus('online');
    } catch (err) {
      setBackendStatus('offline');
    }

    // Check ML Service
    try {
      await analyticsAPI.checkMLHealth();
      setMlStatus('online');
    } catch (err) {
      setMlStatus('offline');
    }
    
    setIsRefreshing(false);
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  const StatusDot = ({ status }) => {
    const colors = {
      online: 'bg-emerald-500 shadow-emerald-500/50',
      offline: 'bg-rose-500 shadow-rose-500/50',
      checking: 'bg-amber-500 shadow-amber-500/50'
    };
    return (
      <div className={`w-2 h-2 rounded-full ${colors[status]} shadow-lg animate-pulse`} />
    );
  };

  return (
    <div className="flex items-center justify-between px-4 md:px-8 py-4 bg-dark-950/50 backdrop-blur-xl border-b border-dark-800 sticky top-0 z-30">
      
      <div className="flex items-center gap-4">
        {/* Hamburger Menu (Mobile Only) */}
        <button 
          onClick={toggleMobileMenu}
          className="md:hidden p-2 text-dark-300 hover:text-white bg-dark-900 border border-dark-800 rounded-xl transition-all"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-4 md:gap-8">
          {/* Backend Status */}
          <div className="flex flex-col gap-1" title="Backend Server Status">
            <div className="flex items-center gap-2">
              <StatusDot status={backendStatus} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white hidden sm:block">API Engine</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-white sm:hidden">API</span>
            </div>
            <span className={`text-[9px] font-medium ml-4 hidden sm:block ${backendStatus === 'online' ? 'text-emerald-500' : 'text-rose-500 opacity-80'}`}>
              {backendStatus === 'online' ? 'Operational' : backendStatus === 'offline' ? 'Offline' : 'Checking...'}
            </span>
          </div>

          {/* ML Status */}
          <div className="flex flex-col gap-1" title="ML Microservice Status">
            <div className="flex items-center gap-2">
              <StatusDot status={mlStatus} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white hidden sm:block">ML Core</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-white sm:hidden">ML</span>
            </div>
            <span className={`text-[9px] font-medium ml-4 hidden sm:block ${mlStatus === 'online' ? 'text-solar' : 'text-rose-500 opacity-80'}`}>
              {mlStatus === 'online' ? 'Active' : mlStatus === 'offline' ? 'Unreachable' : 'Detecting...'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="relative">
          <button 
            onClick={() => setShowDebug(!showDebug)}
            className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              showDebug 
                ? 'bg-solar text-white border-solar shadow-lg shadow-solar-500/20' 
                : 'bg-dark-900 text-dark-300 border-dark-800 hover:border-dark-700'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span className="hidden sm:inline">System Debug</span>
            <ChevronDown className={`w-3 h-3 transition-transform hidden sm:block ${showDebug ? 'rotate-180' : ''}`} />
          </button>

          {showDebug && (
            <div className="absolute top-full mt-3 right-0 w-[calc(100vw-32px)] max-w-72 sm:w-72 bg-dark-900 border border-dark-800 rounded-2xl shadow-2xl p-4 animate-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Health Diagnostics</h4>
                <div className="flex gap-2">
                  <button 
                    onClick={checkHealth}
                    disabled={isRefreshing}
                    className="p-1.5 hover:bg-dark-800 rounded-lg text-dark-400 hover:text-solar transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-dark-950 rounded-xl border border-dark-800">
                  <div className="flex items-center gap-3">
                    <Activity className="w-4 h-4 text-emerald-500" />
                    <div>
                      <p className="text-[10px] text-dark-400 uppercase font-bold leading-none mb-1">API Backend</p>
                      <p className="text-xs font-medium text-white">{backendStatus === 'online' ? 'Operational' : 'Unreachable'}</p>
                    </div>
                  </div>
                  {backendStatus === 'online' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-rose-500" />}
                </div>

                <div className="flex flex-col gap-2 p-3 bg-dark-950 rounded-xl border border-dark-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Cpu className="w-4 h-4 text-solar" />
                      <div>
                        <p className="text-[10px] text-dark-400 uppercase font-bold leading-none mb-1">ML Service</p>
                        <p className="text-xs font-medium text-white">{mlStatus === 'online' ? 'Operational' : 'Unreachable'}</p>
                      </div>
                    </div>
                    {mlStatus === 'online' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-rose-500" />}
                  </div>
                  
                  {mlStatus !== 'online' && (
                    <button 
                      onClick={async () => {
                        setIsRefreshing(true);
                        try {
                          await analyticsAPI.restartML();
                          setTimeout(checkHealth, 5000);
                        } catch (err) {
                          alert('Failed to trigger restart. Check backend connectivity.');
                        }
                        setIsRefreshing(false);
                      }}
                      className="w-full mt-1 py-2 bg-solar/10 hover:bg-solar/20 border border-solar/20 rounded-lg text-[10px] font-bold text-solar transition-all"
                    >
                      Attempt Service Restart
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-dark-800 space-y-3">
                <p className="text-[10px] text-dark-400 uppercase font-bold tracking-wider">System Console</p>
                <div className="bg-dark-950 rounded-xl border border-dark-800 p-3 h-32 overflow-y-auto font-mono text-[10px] space-y-1">
                  {[
                    "[INFO] Core systems active",
                    "[DB] MongoDB Connection: STABLE",
                    "[ML] Model: ARIMA loaded",
                    "[UI] Rendered dashboard in 112ms",
                    "[AUTH] JWT Session refreshed"
                  ].map((log, i) => (
                    <div key={i} className="text-dark-400">
                      <span className="text-solar mr-2 opacity-50">›</span>
                      {log}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-dark-800 space-y-2">
                <p className="text-[9px] text-dark-500 italic">
                  Advanced options:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => window.open('http://localhost:5000/health', '_blank')}
                    className="py-1.5 bg-dark-950 border border-dark-800 rounded-lg text-[9px] text-dark-400 hover:text-white"
                  >
                    Backend Health API
                  </button>
                  <button 
                    onClick={() => window.open('http://localhost:8000/', '_blank')}
                    className="py-1.5 bg-dark-950 border border-dark-800 rounded-lg text-[9px] text-dark-400 hover:text-white"
                  >
                    ML Docs API
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
