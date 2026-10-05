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
} from 'recharts';
import { Activity } from 'lucide-react';

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
  const formatCurrency = (value: number) => {
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(0)}k`;
    return `₹${value}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const val = payload[0].value;
      return (
        <div className="p-3 rounded-xl bg-black text-white shadow-2xl border border-neutral-800">
          <p className="text-[10px] font-mono uppercase text-neutral-400 mb-1">{label} 2026 // EARNINGS</p>
          <div className="flex items-center space-x-2 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
            <span className="text-xs text-neutral-400">Revenue:</span>
            <span className="text-sm font-semibold text-white">
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-tight">
              Annual Revenue Velocity
            </h3>
            <p className="text-xs text-neutral-400">
              12-Month income trajectory across domestic and international projects
            </p>
          </div>
        </div>

        {onSelectMonth && (
          <div className="flex items-center space-x-1 text-xs font-mono bg-neutral-900/90 border border-neutral-800 p-1 rounded-lg">
            <button
              onClick={() => onSelectMonth('all')}
              className={`px-2.5 py-1 rounded transition-all ${
                selectedMonth === 'all'
                  ? 'bg-white text-black font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              ALL 2026
            </button>
            <button
              onClick={() => onSelectMonth('jul')}
              className={`px-2.5 py-1 rounded transition-all ${
                selectedMonth === 'jul'
                  ? 'bg-white text-black font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              JUL (FOCUS)
            </button>
          </div>
        )}
      </div>

      <div className="w-full h-[260px] sm:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="monochromeWaveform" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffffff" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#ffffff" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="2 4"
              vertical={false}
              stroke="rgba(255, 255, 255, 0.05)"
            />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              stroke="#71717a"
              fontSize={11}
              fontFamily="monospace"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              stroke="#71717a"
              fontSize={11}
              fontFamily="monospace"
              tickFormatter={formatCurrency}
              domain={[0, 160000]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#ffffff"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#monochromeWaveform)"
              dot={{ r: 3, fill: '#ffffff', strokeWidth: 1.5, stroke: '#000000' }}
              activeDot={{ r: 5, fill: '#ffffff', stroke: '#000000', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
