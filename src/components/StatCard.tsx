'use client';

import React from 'react';
import { LucideIcon, TrendingUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trendValue?: string;
  variant?: 'accent' | 'default';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  trendValue,
  variant = 'default',
  onClick,
}) => {
  const isAccent = variant === 'accent';

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-[1.25rem] p-6 transition-all duration-300 shadow-xl flex flex-col justify-between space-y-4 ${
        onClick ? 'cursor-pointer hover:-translate-y-1' : ''
      } ${
        isAccent
          ? 'bg-gradient-to-br from-[#064e3b] to-[#10b981] text-white border border-[#34d399]/30'
          : 'bg-gradient-to-b from-[#161616] to-[#0a0a0a] text-white border border-white/[0.08] hover:border-white/[0.15]'
      }`}
    >
      {/* Title */}
      <h3 className={`text-[15px] font-title font-medium ${isAccent ? 'text-white/90' : 'text-neutral-400'}`}>
        {title}
      </h3>

      {/* Value */}
      <div className="text-4xl sm:text-5xl font-heading font-bold tracking-tight">
        {value}
      </div>

      {/* Subtitle / Trend */}
      {(trendValue || subtitle) && (
        <div className="flex items-center space-x-2 pt-2">
          {trendValue && (
            <div className={`flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
              isAccent 
                ? 'bg-white/20 border-white/30 text-white' 
                : 'bg-emerald-900/30 border-emerald-500/30 text-emerald-400'
            }`}>
              <span>{trendValue}</span>
              <TrendingUp className="w-3 h-3" />
            </div>
          )}
          {subtitle && (
            <p className={`text-xs font-title ${isAccent ? 'text-white/80' : 'text-neutral-500'}`}>
              {subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
