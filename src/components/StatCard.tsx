'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
  colorScheme?: 'blue' | 'emerald' | 'amber' | 'indigo' | 'purple' | 'rose';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendType = 'neutral',
  colorScheme = 'blue',
  onClick,
}) => {
  const colorMap = {
    blue: {
      bg: 'bg-blue-500/10 dark:bg-blue-500/20',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-200/60 dark:border-blue-900/40',
      glow: 'group-hover:border-blue-400 dark:group-hover:border-blue-600',
    },
    emerald: {
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
      text: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-200/60 dark:border-emerald-900/40',
      glow: 'group-hover:border-emerald-400 dark:group-hover:border-emerald-600',
    },
    amber: {
      bg: 'bg-amber-500/10 dark:bg-amber-500/20',
      text: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-200/60 dark:border-amber-900/40',
      glow: 'group-hover:border-amber-400 dark:group-hover:border-amber-600',
    },
    indigo: {
      bg: 'bg-indigo-500/10 dark:bg-indigo-500/20',
      text: 'text-indigo-600 dark:text-indigo-400',
      border: 'border-indigo-200/60 dark:border-indigo-900/40',
      glow: 'group-hover:border-indigo-400 dark:group-hover:border-indigo-600',
    },
    purple: {
      bg: 'bg-purple-500/10 dark:bg-purple-500/20',
      text: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-200/60 dark:border-purple-900/40',
      glow: 'group-hover:border-purple-400 dark:group-hover:border-purple-600',
    },
    rose: {
      bg: 'bg-rose-500/10 dark:bg-rose-500/20',
      text: 'text-rose-600 dark:text-rose-400',
      border: 'border-rose-200/60 dark:border-rose-900/40',
      glow: 'group-hover:border-rose-400 dark:group-hover:border-rose-600',
    },
  };

  const scheme = colorMap[colorScheme];

  return (
    <div
      onClick={onClick}
      className={`group relative p-5 rounded-2xl bg-white dark:bg-slate-900/90 border ${scheme.border} ${scheme.glow} shadow-sm hover:shadow-md transition-all duration-200 ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase">
            {title}
          </p>
          <div className="flex items-baseline space-x-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {value}
            </h3>
          </div>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              {subtitle}
            </p>
          )}
        </div>

        <div className={`p-3 rounded-xl ${scheme.bg} ${scheme.text} transition-transform group-hover:scale-110 duration-200`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {trend && (
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-800/60 flex items-center justify-between text-xs">
          <span
            className={`font-semibold ${
              trendType === 'positive'
                ? 'text-emerald-600 dark:text-emerald-400'
                : trendType === 'negative'
                ? 'text-rose-600 dark:text-rose-400'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            {trend}
          </span>
          <span className="text-gray-400 dark:text-gray-500 font-medium">vs last month</span>
        </div>
      )}
    </div>
  );
};
