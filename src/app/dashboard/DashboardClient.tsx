'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/Navbar';
import { StatCard } from '@/components/StatCard';
import { FilterMode } from '@/components/FilterDropdown';
import { GrowthChart } from '@/components/GrowthChart';
import { TransactionsTable } from '@/components/TransactionsTable';
import { AddTransactionModal } from '@/components/AddTransactionModal';
import { EditNameModal } from '@/components/EditNameModal';
import { SetGoalModal } from '@/components/SetGoalModal';
import { INITIAL_EXCHANGE_RATE } from '@/lib/mockData';
import { Transaction } from '@/lib/types';
import { Target } from 'lucide-react';
import { GoalCard } from '@/components/GoalCard';
import { GoalAchievedModal } from '@/components/GoalAchievedModal';

export default function DashboardClient({ initialUser, initialTransactions }: { initialUser: any, initialTransactions: any[] }) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions as Transaction[]);
  const [exchangeRate, setExchangeRate] = useState<number>(INITIAL_EXCHANGE_RATE);
  const [rateDateText, setRateDateText] = useState<string>('');
  const [isRateLoading, setIsRateLoading] = useState(false);
  const [isRateLive, setIsRateLive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // Sync state with server props on revalidation
  useEffect(() => {
    setTransactions(initialTransactions as Transaction[]);
  }, [initialTransactions]);

  // Profile Name and Goal State
  const [dashboardName, setDashboardName] = useState<string>(initialUser.name || 'User');
  const [personalGoal, setPersonalGoal] = useState<number>(initialUser.personalGoal || 0);
  const [isEditNameOpen, setIsEditNameOpen] = useState(false);
  const [isSetGoalOpen, setIsSetGoalOpen] = useState(false);
  const [showGoalAchieved, setShowGoalAchieved] = useState(false);
  const [hasAcknowledgedGoal, setHasAcknowledgedGoal] = useState(false);

  const handleSaveName = async (newName: string) => {
    setDashboardName(newName);
    const { updateName } = await import('./actions');
    await updateName(newName);
  };

  const handleSaveGoal = async (newGoal: number) => {
    setPersonalGoal(newGoal);
    setShowGoalAchieved(false);
    const { updateGoal } = await import('./actions');
    await updateGoal(newGoal);
  };

  // Handle goal achieved acknowledgment state
  useEffect(() => {
    try {
      const ack = localStorage.getItem('nahyan_goal_achieved_for');
      if (ack && parseFloat(ack) === personalGoal) {
        setHasAcknowledgedGoal(true);
      } else {
        setHasAcknowledgedGoal(false);
      }
    } catch {}
  }, [personalGoal]);


  // Auto-fetch live dollar exchange rate for the current date
  const fetchLiveRate = useCallback(async () => {
    setIsRateLoading(true);
    try {
      const res = await fetch('/api/exchange-rate');
      if (res.ok) {
        const data = await res.json();
        if (data.rate && typeof data.rate === 'number') {
          setExchangeRate(data.rate);
          setRateDateText(data.dateText || '');
          setIsRateLive(Boolean(data.isLive));
        }
      }
    } catch (err) {
      console.error('Failed to auto-fetch exchange rate:', err);
    } finally {
      setIsRateLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveRate();
  }, [fetchLiveRate]);

  // Top Right Filter State
  const [filterMode, setFilterMode] = useState<FilterMode>('custom');
  const [selectedYear, setSelectedYear] = useState<string>(() => new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const monthsList = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    return monthsList[new Date().getMonth()];
  });

  // Recalculate transaction INR amounts whenever exchange rate changes
  const activeTransactions = useMemo(() => {
    return transactions.map(tx => {
      if (tx.currency === 'USD') {
        return {
          ...tx,
          exchange_rate: exchangeRate,
          inr_amount: Math.round(tx.amount * exchangeRate)
        };
      }
      return tx;
    });
  }, [transactions, exchangeRate]);

  // Apply Top-Right Filter (Last 7 Days, Last 30 Days, Year & Month, or All Time)
  const filteredTransactions = useMemo(() => {
    if (filterMode === 'all') {
      return activeTransactions;
    }

    if (filterMode === '7d' || filterMode === '30d') {
      const timestamps = activeTransactions
        .map(t => new Date(t.date).getTime())
        .filter(ts => !isNaN(ts));
      const maxTime = timestamps.length > 0 ? Math.max(...timestamps) : Date.now();
      const days = filterMode === '7d' ? 7 : 30;
      const threshold = maxTime - (days * 24 * 60 * 60 * 1000);

      return activeTransactions.filter(t => {
        const time = new Date(t.date).getTime();
        return time >= threshold && time <= maxTime;
      });
    }

    // 'custom': filter by selected Year and Month
    return activeTransactions.filter(t => {
      const txYear = new Date(t.date).getFullYear().toString();
      const matchesYear = selectedYear === 'all' || txYear === selectedYear;
      const matchesMonth = selectedMonth === 'all' || t.month.toLowerCase() === selectedMonth.toLowerCase();
      return matchesYear && matchesMonth;
    });
  }, [activeTransactions, filterMode, selectedYear, selectedMonth]);

  // Compute the 4 Core Metrics: Total Earned INR, Total Earned USD, Total Projects Done, Expenses
  const metrics = useMemo(() => {
    const incomeTxs = filteredTransactions.filter(t => t.type === 'income');
    const expenseTxs = filteredTransactions.filter(t => t.type === 'expense');

    const totalEarnedINR = incomeTxs.reduce((sum, t) => sum + (t.inr_amount || 0), 0);
    const totalEarnedUSD = incomeTxs.filter(t => t.currency === 'USD').reduce((sum, t) => sum + t.amount, 0);
    const totalProjectsDone = incomeTxs.length;
    const totalExpensesINR = expenseTxs.reduce((sum, t) => sum + (t.inr_amount || 0), 0);

    return {
      totalEarnedINR,
      totalEarnedUSD,
      totalProjectsDone,
      totalExpensesINR,
    };
  }, [filteredTransactions]);

  // Trigger modal when goal reached
  useEffect(() => {
    if (personalGoal > 0 && metrics.totalEarnedINR >= personalGoal && !hasAcknowledgedGoal) {
      setShowGoalAchieved(true);
    }
  }, [metrics.totalEarnedINR, personalGoal, hasAcknowledgedGoal]);

  const handleCloseGoalAchieved = () => {
    setShowGoalAchieved(false);
    setHasAcknowledgedGoal(true);
    try {
      localStorage.setItem('nahyan_goal_achieved_for', personalGoal.toString());
    } catch {}
  };


  // Growth Chart Data (Jan - Dec 2026)
  const growthData = useMemo(() => {
    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    const monthLabels: Record<string, string> = {
      jan: 'JAN', feb: 'FEB', mar: 'MAR', apr: 'APR',
      may: 'MAY', jun: 'JUN', jul: 'JUL', aug: 'AUG',
      sep: 'SEP', oct: 'OCT', nov: 'NOV', dec: 'DEC'
    };

    return months.map(m => {
      const monthTxs = activeTransactions.filter(
        tx => tx.month.toLowerCase() === m && tx.type === 'income'
      );
      const rev = monthTxs.reduce((acc, curr) => acc + curr.inr_amount, 0);
      return {
        month: m,
        label: monthLabels[m],
        revenue: rev
      };
    });
  }, [activeTransactions]);

  // Handle Save / Edit Transaction
  const handleSaveTransaction = async (txData: Partial<Transaction>) => {
    // Optimistic UI update
    if (editingTransaction) {
      setTransactions(prev => prev.map(t => t.id === editingTransaction.id ? { ...t, ...txData } as Transaction : t));
    } else {
      setTransactions(prev => [{ ...txData, id: 'temp-' + Date.now() } as Transaction, ...prev]);
    }
    setEditingTransaction(null);
    
    // Save to DB
    const { saveTransaction } = await import('./actions');
    await saveTransaction(txData);
  };

  // Handle Delete
  const handleDeleteTransaction = async (id: string) => {
    if (confirm('Are you sure you want to delete this record?')) {
      setTransactions(prev => prev.filter(t => t.id !== id));
      const { deleteTransaction } = await import('./actions');
      await deleteTransaction(id);
    }
  };

  // Handle Interactive Animated Toggle for Settlement Status
  const handleToggleStatus = async (id: string) => {
    if (id.startsWith('temp-')) return;

    let newStatus = 'Paid';
    setTransactions(prev => prev.map(t => {
      if (t.id === id) {
        newStatus = t.status === 'Paid' ? 'Unpaid' : 'Paid';
        return { ...t, status: newStatus as 'Paid' | 'Unpaid' };
      }
      return t;
    }));
    
    const { saveTransaction } = await import('./actions');
    await saveTransaction({ id, status: newStatus });
  };

  const goalPercentage = personalGoal > 0 ? Math.min(100, Math.round((metrics.totalEarnedINR / personalGoal) * 100)) : 0;

  return (
    <div className="min-h-screen bg-black text-white antialiased selection:bg-white selection:text-black">
      
      {/* Top Header with Dynamic Name, Live Rate, Filters, and Profile Menu */}
      <Navbar 
        onOpenAddModal={() => {
          setEditingTransaction(null);
          setIsModalOpen(true);
        }}
        filterMode={filterMode}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        onSelectPreset={(preset) => {
          if (preset === 'all') {
            setFilterMode('all');
            setSelectedYear('all');
            setSelectedMonth('all');
          } else {
            setFilterMode(preset);
          }
        }}
        onSelectYearMonth={(year, month) => {
          setFilterMode('custom');
          setSelectedYear(year);
          setSelectedMonth(month);
        }}
        exchangeRate={exchangeRate}
        rateDateText={rateDateText}
        isRateLoading={isRateLoading}
        onRefreshRate={fetchLiveRate}
        dashboardName={dashboardName}
        personalGoal={personalGoal}
        currentEarningsINR={metrics.totalEarnedINR}
        onOpenEditName={() => setIsEditNameOpen(true)}
        onOpenSetGoal={() => setIsSetGoalOpen(true)}
      />

      {/* Main Clean Workspace - 90% Screen Width */}
      <main className="w-[90%] mx-auto py-8 space-y-6">
        
        {/* The 4 Core Telemetry Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Earned (INR)"
            value={`₹${metrics.totalEarnedINR.toLocaleString('en-IN')}`}
            subtitle={`Gross income (incl. USD @ ₹${exchangeRate.toFixed(2)})`}
          />

          <StatCard
            title="Total Earned ($)"
            value={`$${metrics.totalEarnedUSD.toLocaleString()}`}
            subtitle={`≈ ₹${Math.round(metrics.totalEarnedUSD * exchangeRate).toLocaleString('en-IN')} at current rate`}
          />

          <StatCard
            title="Total Projects Done"
            value={`${metrics.totalProjectsDone}`}
            subtitle="Completed client deliverables"
          />

          <StatCard
            title="Expenses"
            value={`₹${metrics.totalExpensesINR.toLocaleString('en-IN')}`}
            subtitle="Operating & equipment costs"
          />
        </div>

        {/* Revenue Velocity Waveform Chart & Monthly Goal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 studio-panel rounded-2xl p-6">
            <GrowthChart
              data={growthData}
              selectedMonth={filterMode === 'custom' ? selectedMonth : 'all'}
            />
          </div>
          
          {personalGoal > 0 && (
            <div className="lg:col-span-1">
              <GoalCard currentValue={metrics.totalEarnedINR} goalValue={personalGoal} />
            </div>
          )}
        </div>

        {/* Production & Expense Ledger Table with Animated Settlement Toggle */}
        <TransactionsTable
          transactions={filteredTransactions}
          onDeleteTransaction={handleDeleteTransaction}
          onEditTransaction={(tx) => {
            setEditingTransaction(tx);
            setIsModalOpen(true);
          }}
          onOpenAddModal={() => {
            setEditingTransaction(null);
            setIsModalOpen(true);
          }}
          onToggleStatus={handleToggleStatus}
        />

      </main>

      {/* Add / Edit Transaction Modal */}
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTransaction(null);
        }}
        onSave={handleSaveTransaction}
        onDelete={handleDeleteTransaction}
        editTransaction={editingTransaction}
        defaultExchangeRate={exchangeRate}
      />

      {/* Edit Profile Name Modal */}
      <EditNameModal
        isOpen={isEditNameOpen}
        onClose={() => setIsEditNameOpen(false)}
        currentName={dashboardName}
        onSaveName={handleSaveName}
      />

      {/* Set Personal Goal Modal */}
      <SetGoalModal
        isOpen={isSetGoalOpen}
        onClose={() => setIsSetGoalOpen(false)}
        currentGoal={personalGoal}
        onSaveGoal={handleSaveGoal}
      />

      {/* Goal Achieved Animated Pop-up Modal */}
      <GoalAchievedModal
        isOpen={showGoalAchieved}
        currentGoal={personalGoal}
        onSetNewGoal={handleSaveGoal}
        onClose={handleCloseGoalAchieved}
      />

    </div>
  );
}
