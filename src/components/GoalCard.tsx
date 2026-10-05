'use client';

import React, { useState, useEffect } from 'react';

interface GoalCardProps {
  currentValue: number;
  goalValue: number;
}

export const GoalCard: React.FC<GoalCardProps> = ({ currentValue, goalValue }) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  useEffect(() => {
    // Trigger animation shortly after mount
    const timer = setTimeout(() => {
      const p = goalValue > 0 ? Math.min(100, Math.round((currentValue / goalValue) * 100)) : 0;
      setAnimatedPercentage(p);
    }, 100);
    return () => clearTimeout(timer);
  }, [currentValue, goalValue]);
  
  const radius = 60;
  const pathLength = Math.PI * radius; // 188.495
  const strokeDashoffset = pathLength - (animatedPercentage / 100) * pathLength;

  return (
    <div className="group relative overflow-hidden rounded-[1.25rem] p-6 transition-all duration-300 border border-white/[0.08] bg-gradient-to-b from-[#161616] to-[#0a0a0a] shadow-xl hover:border-white/[0.15] hover:-translate-y-1 flex flex-col justify-between h-full">
      <div className="w-full mb-2">
        <h3 className="text-[15px] font-title font-medium text-neutral-400">
          Monthly Goal
        </h3>
      </div>
      
      <div className="flex-1 flex items-center justify-center w-full min-h-0 py-4">
        <div className="relative w-full max-w-[200px]">
          <svg className="w-full h-auto drop-shadow-sm" viewBox="0 0 160 120">
            <defs>
              <pattern id="stripes" width="6" height="6" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="6" stroke="#27272a" strokeWidth="2" />
              </pattern>
            </defs>
            {/* Background Track */}
            <path
              d="M 20,90 A 60,60 0 0,1 140,90"
              stroke="url(#stripes)"
              strokeWidth="20"
              fill="transparent"
              strokeLinecap="round"
            />
            {/* Progress Track */}
            <path
              d="M 20,90 A 60,60 0 0,1 140,90"
              stroke="currentColor"
              strokeWidth="20"
              fill="transparent"
              strokeLinecap="round"
              strokeDasharray={pathLength}
              strokeDashoffset={strokeDashoffset}
              className="text-emerald-500 transition-all duration-[1500ms] ease-out"
            />
          </svg>
          
          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-0">
            <span className="text-4xl sm:text-5xl font-heading font-bold text-white tracking-tight leading-none">
              {animatedPercentage}%
            </span>
            <span className="text-[10px] font-title text-neutral-400 mt-1">
              Goal Reached
            </span>
          </div>
        </div>
      </div>
      
      {/* Legend & Details */}
      <div className="w-full mt-6 space-y-3">
        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] text-neutral-400 font-title">Earned</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <div 
              className="w-2.5 h-2.5 rounded-full" 
              style={{ background: 'repeating-linear-gradient(45deg, #27272a, #27272a 1px, transparent 1px, transparent 3px)' }} 
            />
            <span className="text-[10px] text-neutral-400 font-title">Remaining</span>
          </div>
        </div>
        <div className="text-center">
          <p className="text-[11px] text-neutral-400 font-mono tracking-tight">
            ₹{currentValue.toLocaleString('en-IN')} / ₹{goalValue.toLocaleString('en-IN')}
          </p>
        </div>
      </div>
    </div>
  );
};
