'use client';

import React, { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';

interface GoalAchievedModalProps {
  isOpen: boolean;
  currentGoal: number;
  onSetNewGoal: (newGoal: number) => void;
  onClose: () => void;
}

export const GoalAchievedModal: React.FC<GoalAchievedModalProps> = ({
  isOpen,
  currentGoal,
  onSetNewGoal,
  onClose
}) => {
  const [newGoal, setNewGoal] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setNewGoal('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(newGoal);
    if (!isNaN(val) && val > 0) {
      onSetNewGoal(val);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
      >
        <div className="p-8 text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center border border-neutral-800 mb-4 animate-bounce">
            <Trophy className="w-8 h-8 text-yellow-500" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-heading font-bold tracking-tight text-white">Goal Achieved!</h2>
            <p className="text-sm text-neutral-400">
              You've successfully hit your target of ₹{currentGoal.toLocaleString('en-IN')}. Time to aim higher!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2 text-left">
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-400">Set New Goal (INR)</label>
              <input
                type="number"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-2.5 text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors font-mono"
                placeholder="e.g. 500000"
                autoFocus
                required
              />
            </div>
            
            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-lg border border-neutral-800 text-neutral-300 font-medium hover:bg-neutral-900 transition-colors text-sm"
              >
                Not Now
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 rounded-lg bg-white text-black font-semibold hover:bg-neutral-200 transition-colors text-sm"
              >
                Set New Goal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
