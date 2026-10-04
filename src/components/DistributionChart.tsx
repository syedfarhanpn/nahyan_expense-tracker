'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useTheme } from 'next-themes';

interface DistributionChartProps {
  uvvCount: number;
  outsideCount: number;
}

export const DistributionChart: React.FC<DistributionChartProps> = ({
  uvvCount,
  outsideCount,
}) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const data = [
    { name: 'UVV Work Count', value: uvvCount, color: '#3b82f6' },
    { name: 'Outside Work Count', value: outsideCount, color: '#ef4444' },
  ];

  const total = uvvCount + outsideCount;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
      return (
        <div className="p-3 rounded-xl bg-slate-900/95 text-white shadow-xl border border-slate-700/80 backdrop-blur-md">
          <p className="text-xs font-semibold" style={{ color: item.payload.color }}>
            {item.name}
          </p>
          <div className="mt-1 flex items-baseline space-x-2">
            <span className="text-lg font-extrabold">{item.value} Projects</span>
            <span className="text-xs text-slate-400">({percentage}%)</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center space-x-2">
          <span>Work Distribution (UVV vs Outside)</span>
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Proportion of UVV tasks vs External Client contracts
        </p>
      </div>

      <div className="w-full h-[220px] sm:h-[250px] relative my-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  stroke={isDark ? '#0f172a' : '#ffffff'} 
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-extrabold text-gray-900 dark:text-white">
            {total}
          </span>
          <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider">
            Total Jobs
          </span>
        </div>
      </div>

      {/* Custom Legend */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-slate-800">
        {data.map((item) => (
          <div key={item.name} className="flex items-center space-x-2 p-2 rounded-lg bg-gray-50 dark:bg-slate-800/50">
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">
                {item.name}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {item.value} items ({total > 0 ? Math.round((item.value / total) * 100) : 0}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
