import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  Map, 
  TrendingUp, 
  PieChart, 
  FileText, 
  LayoutDashboard,
  LogOut,
  Sun,
  Zap,
  Activity
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

const Sidebar = () => {
  const { logout, user } = useAuth();

  return (
    <div className="flex flex-col h-screen w-64 bg-dark-950 text-white border-r border-dark-800">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-solar p-2 rounded-xl">
          <Sun className="w-6 h-6 text-white" />
        </div>
        <span className="font-display font-bold text-lg tracking-tight">SolarIntel</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
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

      <div className="p-4 border-t border-dark-800">
        <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-dark-900/50 rounded-2xl">
          <div className="w-8 h-8 rounded-full bg-solar-500 flex items-center justify-center font-bold text-xs">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-dark-500 truncate">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 text-dark-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
