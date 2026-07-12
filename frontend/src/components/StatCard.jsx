import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const StatCard = ({ label, value, icon: Icon, trend, className, iconClassName }) => {
  return (
    <div className={cn(
      "bg-dark-900 border border-dark-800 p-6 rounded-3xl hover:border-solar/30 transition-all group",
      className
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className={cn(
          "p-3 rounded-2xl bg-dark-950 border border-dark-800 group-hover:bg-solar group-hover:border-solar transition-all duration-300",
          iconClassName
        )}>
          <Icon className="w-6 h-6 text-solar group-hover:text-white transition-colors" />
        </div>
        {trend && (
          <div className={cn(
            "px-2.5 py-1 rounded-full text-xs font-bold",
            trend.isPositive ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
          )}>
            {trend.isPositive ? '+' : '-'}{trend.value}%
          </div>
        )}
      </div>
      <div>
        <p className="text-dark-400 text-sm font-medium mb-1">{label}</p>
        <h3 className="text-2xl font-display font-bold text-white tracking-tight">{value}</h3>
      </div>
    </div>
  );
};

export default StatCard;
