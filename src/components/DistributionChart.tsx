'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Clapperboard } from 'lucide-react';
import { Transaction } from '@/lib/types';

interface DistributionChartProps {
  transactions: Transaction[];
  selectedMonth: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  'YouTube Longform': '#ffffff', // Pure white
  'Brand Commercial': '#d4d4d8', // Light gray
  '9:16 Short/Reel': '#a1a1aa', // Medium light gray
  'Color Grade & Finishing': '#71717a', // Medium gray
  'Motion Graphics': '#52525b', // Darker gray
  'Doc / Narrative': '#3f3f46', // Dark gray
  'Other Deliverables': '#27272a',
};

export const DistributionChart: React.FC<DistributionChartProps> = ({
  transactions,
  selectedMonth
}) => {
  // Aggregate income by project_type
  const incomeTxs = transactions.filter(
    tx => tx.type === 'income' && (selectedMonth === 'all' || tx.month.toLowerCase() === selectedMonth.toLowerCase())
  );

  const categoryMap: Record<string, { count: number; revenue: number }> = {};

  incomeTxs.forEach(tx => {
    const key = tx.project_type || (tx.source === 'UVV Work' ? 'Commercial Production' : 'Independent Clients');
    if (!categoryMap[key]) {
      categoryMap[key] = { count: 0, revenue: 0 };
    }
    categoryMap[key].count += 1;
    categoryMap[key].revenue += tx.inr_amount;
  });

  const data = Object.entries(categoryMap).map(([name, stats]) => ({
    name,
    count: stats.count,
    value: stats.revenue,
    color: CATEGORY_COLORS[name] || '#a1a1aa'
  })).sort((a, b) => b.value - a.value);

  const totalRevenue = data.reduce((acc, curr) => acc + curr.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      const pct = totalRevenue > 0 ? ((item.value / totalRevenue) * 100).toFixed(1) : 0;
      return (
        <div className="p-3 rounded-xl bg-black text-white shadow-2xl border border-neutral-800">
          <p className="text-xs font-semibold text-neutral-200">
            {item.name}
          </p>
          <div className="mt-1 flex items-baseline space-x-2 font-mono">
            <span className="text-sm font-semibold text-white">₹{item.value.toLocaleString('en-IN')}</span>
            <span className="text-xs text-neutral-400">({pct}% • {item.payload.count} cuts)</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="flex items-center space-x-2.5">
        <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white">
          <Clapperboard className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white tracking-tight">
            Revenue by Edit Format
          </h3>
          <p className="text-xs text-neutral-400">
            Share of revenue across video disciplines
          </p>
        </div>
      </div>

      <div className="w-full h-[200px] sm:h-[220px] relative my-3">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data.length > 0 ? data : [{ name: 'No data', value: 1, color: '#27272a', count: 0 }]}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  stroke="#000000"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-bold font-mono text-white">
            {incomeTxs.length}
          </span>
          <span className="text-[10px] uppercase font-mono text-neutral-400 tracking-wider">
            Total Cuts
          </span>
        </div>
      </div>

      {/* Breakdown list */}
      <div className="space-y-1.5 pt-3 border-t border-neutral-800/80">
        {data.slice(0, 4).map((item) => {
          const pct = totalRevenue > 0 ? Math.round((item.value / totalRevenue) * 100) : 0;
          return (
            <div key={item.name} className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-neutral-900/60 border border-neutral-800/60">
              <div className="flex items-center space-x-2 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full shrink-0 border border-neutral-700" style={{ backgroundColor: item.color }} />
                <span className="text-neutral-300 font-medium truncate max-w-[140px]">{item.name}</span>
              </div>
              <div className="flex items-center space-x-2 font-mono text-[11px] text-right">
                <span className="text-white font-medium">₹{item.value.toLocaleString('en-IN')}</span>
                <span className="text-neutral-500">({pct}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
