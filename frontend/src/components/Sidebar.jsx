import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BarChart3, Map, TrendingUp, PieChart, FileText, 
  LayoutDashboard, LogOut, Sun, Zap, Activity, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const menuItems = [
  { icon: FileText, label: 'Project Overview', path: '/overview' },
  { icon: LayoutDashboard, label: 'Executive', path: '/dashboard' },
  { icon: Activity, label: 'Analytics', path: '/analytics' },
  { icon: Map, label: 'Geo Analytics', path: '/geo' },
  { icon: BarChart3, label: 'Sales Intelligence', path: '/sales' },
  { icon: TrendingUp, label: 'Forecast', path: '/forecast' },
  { icon: PieChart, label: 'Revenue', path: '/revenue' },
  { icon: Zap, label: 'Innovation Hub', path: '/innovation' },
];

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { logout, user } = useAuth();

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <div className={`
        fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        flex flex-col h-screen w-64 bg-dark-950 text-white border-r border-dark-800
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-solar p-2 rounded-xl shadow-lg shadow-solar-500/20">
              <Sun className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight">SolarIntel</span>
          </div>
          {/* Close button for mobile */}
          <button 
            className="md:hidden p-2 text-dark-400 hover:text-white bg-dark-900 rounded-lg"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)} // Close on click for mobile
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive 
                  ? 'bg-solar text-white shadow-lg shadow-solar-500/20' 
                  : 'text-dark-400 hover:bg-dark-900 hover:text-white'}
              `}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-dark-800 bg-dark-950">
          <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-dark-900/50 rounded-2xl border border-dark-800/50">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-solar-400 to-solar-600 flex items-center justify-center font-bold text-xs shadow-lg shadow-solar-500/20">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-white">{user?.name}</p>
              <p className="text-xs text-dark-400 truncate">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 text-dark-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
