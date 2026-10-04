'use client';

import React, { useState } from 'react';
import { DollarSign, ArrowRightLeft, RefreshCw, Check } from 'lucide-react';

interface CurrencyConverterProps {
  rate: number;
  onRateChange: (newRate: number) => void;
}

export const CurrencyConverter: React.FC<CurrencyConverterProps> = ({
  rate,
  onRateChange,
}) => {
  const [editingRate, setEditingRate] = useState(false);
  const [tempRate, setTempRate] = useState(rate.toString());
  const [usdVal, setUsdVal] = useState<string>('1490');
  const [inrVal, setInrVal] = useState<string>((1490 * rate).toString());

  const handleUsdChange = (val: string) => {
    setUsdVal(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setInrVal((num * rate).toFixed(0));
    } else {
      setInrVal('');
    }
  };

  const handleInrChange = (val: string) => {
    setInrVal(val);
    const num = parseFloat(val);
    if (!isNaN(num) && rate > 0) {
      setUsdVal((num / rate).toFixed(2));
    } else {
      setUsdVal('');
    }
  };

  const saveRate = () => {
    const parsed = parseFloat(tempRate);
    if (!isNaN(parsed) && parsed > 0) {
      onRateChange(parsed);
      const usdNum = parseFloat(usdVal);
      if (!isNaN(usdNum)) {
        setInrVal((usdNum * parsed).toFixed(0));
      }
    }
    setEditingRate(false);
  };

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <ArrowRightLeft className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">
              Live Currency Converter
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              USD to INR exchange rate calculator
            </p>
          </div>
        </div>

        {/* Exchange Rate Edit Button */}
        <div className="flex items-center space-x-1 bg-gray-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">1 USD =</span>
          {editingRate ? (
            <div className="flex items-center space-x-1">
              <input
                type="number"
                value={tempRate}
                onChange={(e) => setTempRate(e.target.value)}
                className="w-14 px-1 py-0.5 text-xs font-bold rounded bg-white dark:bg-slate-900 border border-brand-500 text-gray-900 dark:text-white focus:outline-none"
                step="0.1"
              />
              <button
                onClick={saveRate}
                className="p-0.5 rounded bg-emerald-500 text-white hover:bg-emerald-600 transition"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setTempRate(rate.toString());
                setEditingRate(true);
              }}
              className="text-xs font-extrabold text-brand-600 dark:text-brand-400 hover:underline flex items-center space-x-1"
            >
              <span>₹{rate} INR</span>
              <RefreshCw className="w-3 h-3 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Converter Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center justify-between">
            <span>USD ($)</span>
            <span className="text-[10px] text-gray-400">United States Dollar</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 text-sm font-bold">
              $
            </span>
            <input
              type="number"
              value={usdVal}
              onChange={(e) => handleUsdChange(e.target.value)}
              placeholder="0.00"
              className="w-full pl-7 pr-3 py-2 text-sm font-semibold rounded-xl bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center justify-between">
            <span>INR (₹)</span>
            <span className="text-[10px] text-gray-400">Indian Rupee</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 text-sm font-bold">
              ₹
            </span>
            <input
              type="number"
              value={inrVal}
              onChange={(e) => handleInrChange(e.target.value)}
              placeholder="0.00"
              className="w-full pl-7 pr-3 py-2 text-sm font-semibold rounded-xl bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
