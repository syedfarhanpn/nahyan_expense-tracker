'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, PlusCircle, RefreshCw, User, Target, ChevronDown } from 'lucide-react';
import { FilterDropdown, FilterMode } from './FilterDropdown';

interface NavbarProps {
  onOpenAddModal?: () => void;
  userEmail?: string | null;
  onLogout?: () => void;
  filterMode?: FilterMode;
  selectedYear?: string;
  selectedMonth?: string;
  onSelectPreset?: (preset: '7d' | '30d' | 'all') => void;
  onSelectYearMonth?: (year: string, month: string) => void;
  exchangeRate?: number;
  rateDateText?: string;
  isRateLoading?: boolean;
  onRefreshRate?: () => void;
  dashboardName?: string;
  personalGoal?: number;
  currentEarningsINR?: number;
  onOpenEditName?: () => void;
  onOpenSetGoal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenAddModal, 
  userEmail, 
  onLogout,
  filterMode = 'all',
  selectedYear = 'ALL',
  selectedMonth = 'ALL',
  onSelectPreset,
  onSelectYearMonth,
  exchangeRate,
  rateDateText,
  isRateLoading,
  onRefreshRate,
  dashboardName = 'Nahyan',
  personalGoal = 200000,
  currentEarningsINR = 0,
  onOpenEditName,
  onOpenSetGoal,
}) => {
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  const initialLetter = (dashboardName || 'Nahyan')[0]?.toUpperCase() || 'N';

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-black/90 border-b border-white/10">
      <div className="w-[90%] mx-auto">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand - Dynamic Dashboard Title */}
          <div className="flex items-center space-x-3">
            <Link href="/dashboard" className="flex items-center space-x-2.5 group">
              <span className="font-title font-bold text-lg sm:text-xl tracking-tight text-white">
                {dashboardName || 'Nahyan'}'s Dashboard
              </span>
            </Link>
          </div>

          {/* Right Action Items: Live Dollar Rate, Filter Dropdown, Quick Add, and Profile */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            
            {/* Auto-fetched Live Dollar Rate Badge */}
            {exchangeRate !== undefined && exchangeRate > 0 && (
              <div 
                className="inline-flex items-center space-x-1.5 sm:space-x-2 px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-300 shadow-sm"
                title={rateDateText ? `Exchange rate updated: ${rateDateText}` : 'Auto-fetched USD/INR Rate'}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span className="text-neutral-400 hidden md:inline">1 USD =</span>
                <span className="font-semibold text-white">₹{exchangeRate.toFixed(2)}</span>

                {onRefreshRate && (
                  <button 
                    onClick={onRefreshRate} 
                    disabled={isRateLoading}
                    className="text-neutral-400 hover:text-white transition-colors ml-0.5 p-0.5"
                    title="Refresh live dollar rate"
                  >
                    <RefreshCw className={`w-3 h-3 ${isRateLoading ? 'animate-spin text-white' : ''}`} />
                  </button>
                )}
              </div>
            )}

            {/* Top Right Filter Component (Last 7d, 30d, Year, Month) */}
            {onSelectPreset && onSelectYearMonth && (
              <FilterDropdown
                filterMode={filterMode}
                selectedYear={selectedYear}
                selectedMonth={selectedMonth}
                onSelectPreset={onSelectPreset}
                onSelectYearMonth={onSelectYearMonth}
              />
            )}

            {/* Quick Add Button */}
            {onOpenAddModal && (
              <button
                onClick={onOpenAddModal}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-neutral-200 text-black font-semibold text-xs transition-all active:scale-95 shadow-sm"
              >
                <PlusCircle className="w-3.5 h-3.5 stroke-[2.5]" />
                <span className="hidden sm:inline">Add Entry</span>
              </button>
            )}

            {/* Profile Icon with Dropdown (Edit Name, Set Goal, Logout) */}
            <div className="relative pl-1 border-l border-neutral-800" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-1 pl-1.5 pr-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white transition active:scale-95 cursor-pointer"
                title="Profile & Settings"
              >
                <div className="w-6 h-6 rounded-lg bg-white text-black flex items-center justify-center font-bold text-xs select-none">
                  {initialLetter}
                </div>
                <span className="text-xs font-medium hidden sm:inline select-none">{dashboardName || 'Nahyan'}</span>
                <ChevronDown className={`w-3 h-3 text-neutral-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-neutral-950 border border-neutral-800 shadow-2xl p-3.5 space-y-3 z-50 animate-in fade-in zoom-in-95">
                  
                  {/* User Profile Card */}
                  <div className="flex items-center space-x-3 pb-3 border-b border-neutral-800">
                    <div className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center font-bold text-sm shadow-sm select-none">
                      {initialLetter}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-heading font-semibold text-white truncate">{dashboardName || 'Nahyan'}</p>
                      <p className="text-xs text-neutral-400 truncate">{userEmail || 'Video Editor / Creator'}</p>
                    </div>
                  </div>

                  {/* Personal Goal Progress */}
                  {personalGoal > 0 && (
                    <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-neutral-400">Monthly Target</span>
                        <span className="text-white font-medium">₹{personalGoal.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-white rounded-full transition-all duration-500" 
                          style={{ width: `${Math.min(100, Math.round((currentEarningsINR / personalGoal) * 100))}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-xs font-mono text-neutral-400">
                        <span>₹{currentEarningsINR.toLocaleString('en-IN')} earned</span>
                        <span>{Math.round((currentEarningsINR / personalGoal) * 100)}%</span>
                      </div>
                    </div>
                  )}

                  {/* Profile Actions */}
                  <div className="space-y-1 pt-1">
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        onOpenEditName?.();
                      }}
                      className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs text-neutral-300 hover:text-white hover:bg-neutral-900 transition text-left cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Edit Profile Name</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        onOpenSetGoal?.();
                      }}
                      className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs text-neutral-300 hover:text-white hover:bg-neutral-900 transition text-left cursor-pointer"
                    >
                      <Target className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Set Personal Goal</span>
                    </button>
                  </div>

                  {/* Log Out */}
                  <div className="pt-2 border-t border-neutral-800">
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        if (onLogout) onLogout();
                        else router.push('/login');
                      }}
                      className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-neutral-900 transition text-left cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>

                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
