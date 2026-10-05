'use client';

import React, { useState, useRef, useEffect } from 'react';
import { SlidersHorizontal, ChevronDown, Check, Calendar } from 'lucide-react';

export type FilterMode = '7d' | '30d' | 'custom' | 'all';

interface FilterDropdownProps {
  filterMode: FilterMode;
  selectedYear: string;
  selectedMonth: string;
  onSelectPreset: (preset: '7d' | '30d' | 'all') => void;
  onSelectYearMonth: (year: string, month: string) => void;
}

const MONTHS = [
  { value: 'all', label: 'All Months' },
  { value: 'jan', label: 'Jan' },
  { value: 'feb', label: 'Feb' },
  { value: 'mar', label: 'Mar' },
  { value: 'apr', label: 'Apr' },
  { value: 'may', label: 'May' },
  { value: 'jun', label: 'Jun' },
  { value: 'jul', label: 'Jul' },
  { value: 'aug', label: 'Aug' },
  { value: 'sep', label: 'Sep' },
  { value: 'oct', label: 'Oct' },
  { value: 'nov', label: 'Nov' },
  { value: 'dec', label: 'Dec' },
];

const YEARS = ['2026', '2025', 'all'];

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  filterMode,
  selectedYear,
  selectedMonth,
  onSelectPreset,
  onSelectYearMonth,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Compute active button label
  const getFilterLabel = () => {
    if (filterMode === '7d') return 'Last 7 Days';
    if (filterMode === '30d') return 'Last 30 Days';
    if (filterMode === 'all') return 'All Time';
    
    const monthObj = MONTHS.find(m => m.value.toLowerCase() === selectedMonth.toLowerCase());
    const mLabel = monthObj ? (monthObj.value === 'all' ? 'All Months' : monthObj.label) : selectedMonth;
    const yLabel = selectedYear === 'all' ? '' : selectedYear;
    return `${mLabel} ${yLabel}`.trim();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-mono text-neutral-200 transition-colors"
        title="Filter by period, year, and month"
      >
        <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400" />
        <span className="font-medium text-white">{getFilterLabel()}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-xl bg-neutral-950 border border-neutral-800 shadow-2xl p-4 z-50 space-y-3 font-mono text-xs">
          
          {/* Quick Presets Section */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase text-neutral-500 tracking-wider">
              Quick Filter
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onSelectPreset('7d');
                  setIsOpen(false);
                }}
                className={`py-1.5 px-3 rounded-lg text-left transition-colors flex items-center justify-between ${
                  filterMode === '7d'
                    ? 'bg-white text-black font-semibold'
                    : 'bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <span>Last 7 Days</span>
                {filterMode === '7d' && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
              </button>

              <button
                onClick={() => {
                  onSelectPreset('30d');
                  setIsOpen(false);
                }}
                className={`py-1.5 px-3 rounded-lg text-left transition-colors flex items-center justify-between ${
                  filterMode === '30d'
                    ? 'bg-white text-black font-semibold'
                    : 'bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <span>Last 30 Days</span>
                {filterMode === '30d' && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
              </button>
            </div>
          </div>

          <div className="border-t border-neutral-800/80 pt-3 space-y-2.5">
            
            {/* Year Selector */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] uppercase text-neutral-500 tracking-wider">
                <span>Select Year</span>
                {filterMode === 'custom' && selectedYear !== 'all' && (
                  <span className="text-white font-bold">{selectedYear}</span>
                )}
              </div>
              <div className="flex items-center space-x-1.5">
                {YEARS.map(y => (
                  <button
                    key={y}
                    onClick={() => {
                      onSelectYearMonth(y, selectedMonth || 'all');
                    }}
                    className={`flex-1 py-1 rounded text-center transition-colors ${
                      filterMode === 'custom' && selectedYear === y
                        ? 'bg-white text-black font-semibold'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {y === 'all' ? 'All Years' : y}
                  </button>
                ))}
              </div>
            </div>

            {/* Month Selector */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] uppercase text-neutral-500 tracking-wider">
                Select Month
              </span>
              <div className="grid grid-cols-4 gap-1.5 text-center">
                {MONTHS.map(m => {
                  const isActive = filterMode === 'custom' && selectedMonth.toLowerCase() === m.value.toLowerCase();
                  return (
                    <button
                      key={m.value}
                      onClick={() => {
                        onSelectYearMonth(selectedYear || '2026', m.value);
                        setIsOpen(false);
                      }}
                      className={`py-1 px-1.5 rounded transition-colors text-[11px] ${
                        isActive
                          ? 'bg-white text-black font-semibold'
                          : 'bg-neutral-900 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {m.label}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* All Time Reset */}
          <div className="border-t border-neutral-800/80 pt-2 flex justify-between items-center text-[11px]">
            <button
              onClick={() => {
                onSelectPreset('all');
                setIsOpen(false);
              }}
              className="text-neutral-400 hover:text-white transition-colors"
            >
              Reset to All Time
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="px-2.5 py-1 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white"
            >
              Done
            </button>
          </div>

        </div>
      )}
    </div>
  );
};
