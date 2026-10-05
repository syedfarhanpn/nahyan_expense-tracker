'use client';

import React, { useState, useEffect } from 'react';
import { X, Target } from 'lucide-react';

interface SetGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGoal: number;
  onSaveGoal: (newGoal: number) => void;
}

const PRESET_GOALS = [
  { label: '₹1 Lakh', value: 100000 },
  { label: '₹1.5 Lakhs', value: 150000 },
  { label: '₹2 Lakhs', value: 200000 },
  { label: '₹3 Lakhs', value: 300000 },
  { label: '₹5 Lakhs', value: 500000 },
];

export const SetGoalModal: React.FC<SetGoalModalProps> = ({
  isOpen,
  onClose,
  currentGoal,
  onSaveGoal,
}) => {
  const [goal, setGoal] = useState<string>(currentGoal.toString());

  useEffect(() => {
    setGoal(currentGoal.toString());
  }, [currentGoal, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(goal);
    if (!isNaN(parsed) && parsed > 0) {
      onSaveGoal(parsed);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-sm studio-panel rounded-2xl border border-neutral-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-tight">Set Personal Goal</h3>
              <p className="text-[11px] text-neutral-400">Monthly target earning in INR</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
              Target Monthly Revenue (₹ INR)
            </label>
            <input
              type="number"
              required
              min="0"
              step="1000"
              placeholder="e.g. 200000"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white font-mono font-semibold text-base placeholder-neutral-500 focus:outline-none focus:border-white"
            />
          </div>

          {/* Quick Preset Buttons */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase text-neutral-400">Quick Presets</label>
            <div className="grid grid-cols-3 gap-1.5">
              {PRESET_GOALS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setGoal(p.value.toString())}
                  className={`px-2 py-1.5 rounded-lg text-xs font-mono transition border ${
                    goal === p.value.toString()
                      ? 'bg-white text-black border-white font-semibold'
                      : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:text-white hover:border-neutral-700'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2.5 pt-2 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-xs text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-white hover:bg-neutral-200 text-black font-semibold text-xs transition shadow-sm"
            >
              Save Goal
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
