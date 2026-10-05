'use client';

import React, { useState } from 'react';
import { ArrowRightLeft, RefreshCw, Check, Banknote, ShieldCheck } from 'lucide-react';

interface CurrencyConverterProps {
  rate: number;
  onRateChange: (newRate: number) => void;
}

const PRESETS = [
  { label: 'Reels Pack', amount: 550 },
  { label: 'Retention Edit', amount: 800 },
  { label: 'Monthly Retainer', amount: 1500 },
  { label: 'Commercial Cut', amount: 2500 },
];

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

  const applyPreset = (amount: number) => {
    setUsdVal(amount.toString());
    setInrVal((amount * rate).toFixed(0));
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

  const usdNum = parseFloat(usdVal) || 0;
  const inrGross = Math.round(usdNum * rate);
  const estWireFeeINR = Math.round(inrGross * 0.015); // ~1.5% typical FX / intermediary wire fee
  const netTakeHomeINR = Math.max(0, inrGross - estWireFeeINR);

  return (
    <div className="studio-panel rounded-2xl p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white">
            <ArrowRightLeft className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white tracking-tight">
              USD ⇄ INR Currency Converter
            </h4>
            <p className="text-xs text-neutral-400">
              International client wire conversion and domestic yield calculator
            </p>
          </div>
        </div>

        {/* Peg Rate Badge */}
        <div className="flex items-center space-x-1.5 bg-neutral-900 border border-neutral-800 px-3 py-1 rounded-lg font-mono text-xs">
          <span className="text-neutral-400">$1 =</span>
          {editingRate ? (
            <div className="flex items-center space-x-1">
              <input
                type="number"
                value={tempRate}
                onChange={(e) => setTempRate(e.target.value)}
                className="w-16 px-1.5 py-0.5 text-xs font-semibold rounded bg-black border border-neutral-700 text-white focus:outline-none"
                step="0.5"
                autoFocus
              />
              <button
                onClick={saveRate}
                className="p-1 rounded bg-white text-black font-bold hover:bg-neutral-200 transition"
              >
                <Check className="w-3 h-3 stroke-[3]" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setTempRate(rate.toString());
                setEditingRate(true);
              }}
              className="font-medium text-white hover:text-neutral-300 flex items-center space-x-1"
              title="Click to calibrate exchange rate"
            >
              <span>₹{rate}</span>
              <RefreshCw className="w-3 h-3 text-neutral-500 ml-1" />
            </button>
          )}
        </div>
      </div>

      {/* Dual Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center justify-between">
            <span>Client Fee (USD)</span>
            <span className="text-neutral-500">Gross Wire</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neutral-400 font-mono text-sm">
              $
            </span>
            <input
              type="number"
              value={usdVal}
              onChange={(e) => handleUsdChange(e.target.value)}
              placeholder="0.00"
              className="w-full pl-8 pr-3.5 py-2.5 text-sm font-mono font-medium rounded-xl bg-neutral-900/80 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-white transition"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center justify-between">
            <span>Domestic Payout (INR)</span>
            <span className="text-neutral-500">Bank Transfer</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neutral-400 font-mono text-sm">
              ₹
            </span>
            <input
              type="number"
              value={inrVal}
              onChange={(e) => handleInrChange(e.target.value)}
              placeholder="0.00"
              className="w-full pl-8 pr-3.5 py-2.5 text-sm font-mono font-medium rounded-xl bg-neutral-900/80 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-white transition"
            />
          </div>
        </div>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-xs font-mono uppercase text-neutral-500 mr-1">Presets:</span>
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => applyPreset(p.amount)}
            className="px-2.5 py-1 rounded-lg text-xs font-mono bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 transition"
          >
            ${p.amount} ({p.label})
          </button>
        ))}
      </div>

      {/* Wire & Net Breakdown */}
      <div className="p-3.5 rounded-xl bg-neutral-900/50 border border-neutral-800/80 flex flex-wrap items-center justify-between text-xs font-mono text-neutral-400 gap-2">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-white" />
          <span>Net Domestic Yield:</span>
          <span className="text-white font-semibold font-mono text-sm">
            ₹{netTakeHomeINR.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="text-neutral-500">
          Est. FX & Intermediary Wire Fee (~1.5%): ₹{estWireFeeINR.toLocaleString('en-IN')}
        </div>
      </div>
    </div>
  );
};
