'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { useTheme } from 'next-themes';

interface GrowthChartProps {
  data: {
    month: string;
    label: string;
    revenue: number;
  }[];
  selectedMonth?: string;
  onSelectMonth?: (month: string) => void;
}

export const GrowthChart: React.FC<GrowthChartProps> = ({
  data,
  selectedMonth,
  onSelectMonth
}) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const formatCurrency = (value: number) => {
    if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(0)}k`;
    return `₹${value}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const val = payload[0].value;
      return (
        <div className="p-3 rounded-xl bg-slate-900/95 text-white shadow-xl border border-slate-700/80 backdrop-blur-md">
          <p className="text-xs font-medium text-slate-400 mb-1">{label} 2026</p>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-500"></span>
            <span className="text-xs font-semibold text-slate-200">Revenue:</span>
            <span className="text-sm font-extrabold text-brand-400">
              ₹{val.toLocaleString('en-IN')} INR
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center space-x-2">
            <span>Monthly Revenue Growth (INR)</span>
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Track income trajectory across all 12 months
          </p>
        </div>

        {onSelectMonth && (
          <div className="flex items-center space-x-1 text-xs font-medium bg-gray-100 dark:bg-slate-800 p-1 rounded-lg">
            <span className="text-gray-500 dark:text-gray-400 px-2">Filter:</span>
            <button
              onClick={() => onSelectMonth('all')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                selectedMonth === 'all'
                  ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm font-bold'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => onSelectMonth('jul')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                selectedMonth === 'jul'
                  ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm font-bold'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Jul (Selected)
            </button>
          </div>
        )}
      </div>

      <div className="w-full h-[280px] sm:h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0c92eb" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#0c92eb" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={isDark ? '#334155' : '#e2e8f0'}
            />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              stroke={isDark ? '#94a3b8' : '#64748b'}
              fontSize={12}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              stroke={isDark ? '#94a3b8' : '#64748b'}
              fontSize={12}
              tickFormatter={formatCurrency}
              domain={[0, 200000]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#0c92eb"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#revenueGradient)"
              dot={{ r: 4, fill: '#0c92eb', strokeWidth: 2, stroke: isDark ? '#0f172a' : '#ffffff' }}
              activeDot={{ r: 7, fill: '#38bdf8', stroke: isDark ? '#0f172a' : '#ffffff', strokeWidth: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
