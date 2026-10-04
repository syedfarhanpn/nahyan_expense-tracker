'use client';

import React, { useState, useMemo } from 'react';
import { Navbar } from '@/components/Navbar';
import { StatCard } from '@/components/StatCard';
import { GrowthChart } from '@/components/GrowthChart';
import { DistributionChart } from '@/components/DistributionChart';
import { TransactionsTable } from '@/components/TransactionsTable';
import { AddTransactionModal } from '@/components/AddTransactionModal';
import { CurrencyConverter } from '@/components/CurrencyConverter';
import { INITIAL_TRANSACTIONS, INITIAL_EXCHANGE_RATE, MONTH_OPTIONS } from '@/lib/mockData';
import { Transaction, DashboardSummary } from '@/lib/types';
import { 
  DollarSign, 
  Wallet, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  Layers, 
  Briefcase, 
  ArrowRightLeft,
  Calendar,
  Filter,
  Download,
  Sparkles
} from 'lucide-react';

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [exchangeRate, setExchangeRate] = useState<number>(INITIAL_EXCHANGE_RATE);
  const [selectedMonth, setSelectedMonth] = useState<string>('jul'); // Default selected month: July
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

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

  // Compute summary stats based on selected month (or all months)
  const summary: DashboardSummary = useMemo(() => {
    const monthFiltered = selectedMonth === 'all' 
      ? activeTransactions 
      : activeTransactions.filter(tx => tx.month.toLowerCase() === selectedMonth.toLowerCase());

    const incomeTxs = monthFiltered.filter(tx => tx.type === 'income');
    const expenseTxs = monthFiltered.filter(tx => tx.type === 'expense');

    let totalUSD = 0;
    let totalINR = 0;
    let paidINR = 0;
    let unpaidINR = 0;
    let totalRevenueINR = 0;
    let totalPaidRevenueINR = 0;
    let totalUnpaidRevenueINR = 0;
    let totalExpensesINR = 0;
    let uvvWorkCount = 0;
    let outsideWorkCount = 0;

    incomeTxs.forEach(tx => {
      if (tx.currency === 'USD') {
        totalUSD += tx.amount;
      } else {
        totalINR += tx.amount;
      }

      totalRevenueINR += tx.inr_amount;

      if (tx.status === 'Paid') {
        totalPaidRevenueINR += tx.inr_amount;
        if (tx.currency === 'INR') paidINR += tx.amount;
      } else {
        totalUnpaidRevenueINR += tx.inr_amount;
        if (tx.currency === 'INR') unpaidINR += tx.amount;
      }

      if (tx.source === 'UVV Work') uvvWorkCount++;
      if (tx.source === 'Outside Work') outsideWorkCount++;
    });

    expenseTxs.forEach(tx => {
      totalExpensesINR += tx.inr_amount;
    });

    return {
      selectedMonth,
      usdToInrRate: exchangeRate,
      totalUSD,
      totalINR,
      paidINR,
      unpaidINR,
      totalRevenueINR,
      totalPaidRevenueINR,
      totalUnpaidRevenueINR,
      totalExpensesINR,
      netProfitINR: totalRevenueINR - totalExpensesINR,
      uvvWorkCount,
      outsideWorkCount,
    };
  }, [activeTransactions, selectedMonth, exchangeRate]);

  // Compute monthly growth data (Jan - Dec 2026) for chart
  const growthData = useMemo(() => {
    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    const monthLabels: Record<string, string> = {
      jan: 'Jan', feb: 'Feb', mar: 'Mar', apr: 'Apr',
      may: 'May', jun: 'Jun', jul: 'Jul', aug: 'Aug',
      sep: 'Sep', oct: 'Oct', nov: 'Nov', dec: 'Dec'
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
  const handleSaveTransaction = (txData: Partial<Transaction>) => {
    if (editingTransaction) {
      setTransactions(prev => prev.map(t => t.id === editingTransaction.id ? { ...t, ...txData } as Transaction : t));
    } else {
      setTransactions(prev => [txData as Transaction, ...prev]);
    }
    setEditingTransaction(null);
  };

  // Handle Delete
  const handleDeleteTransaction = (id: string) => {
    if (confirm('Are you sure you want to delete this transaction record?')) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  // Export Summary Report
  const handleExportCSV = () => {
    const headers = ['ID', 'Title', 'Type', 'Source', 'Currency', 'Amount', 'Exchange Rate', 'INR Amount', 'Status', 'Date', 'Month', 'Client'];
    const rows = activeTransactions.map(t => [
      t.id, t.title, t.type, t.source, t.currency, t.amount, t.exchange_rate, t.inr_amount, t.status, t.date, t.month, t.client_name || ''
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nahyan_earnings_report_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      
      {/* Top Navbar */}
      <Navbar 
        onOpenAddModal={() => {
          setEditingTransaction(null);
          setIsModalOpen(true);
        }}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Dashboard Title & Month Selector Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 shadow-sm">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                FREELANCE REVENUE DASHBOARD
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                Live
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Overview of client revenues, USD/INR conversions, and work distribution.
            </p>
          </div>

          {/* Controls: Month Selector & Export */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Selected Month Dropdown */}
            <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800/90 px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700">
              <Calendar className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Selected Month:</span>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-transparent text-xs font-bold text-gray-900 dark:text-white focus:outline-none cursor-pointer"
              >
                {MONTH_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value} className="dark:bg-slate-900 text-gray-900 dark:text-white">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Export CSV Button */}
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 font-semibold text-xs border border-gray-200 dark:border-slate-700 transition"
              title="Download CSV Report"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>

          </div>
        </div>

        {/* Primary KPI Grid (Matching Excel Header Figures) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            title="Total Revenue (INR)"
            value={`₹${summary.totalRevenueINR.toLocaleString('en-IN')}`}
            subtitle={selectedMonth === 'all' ? 'Across all months' : `Filtered for ${selectedMonth.toUpperCase()}`}
            icon={TrendingUp}
            colorScheme="blue"
            trend="+100% Paid"
            trendType="positive"
          />

          <StatCard
            title="Total Paid Revenue (INR)"
            value={`₹${summary.totalPaidRevenueINR.toLocaleString('en-IN')}`}
            subtitle="Received in Bank Account"
            icon={CheckCircle}
            colorScheme="emerald"
            trend="Settled"
            trendType="positive"
          />

          <StatCard
            title="Total Unpaid Revenue (INR)"
            value={`₹${summary.totalUnpaidRevenueINR.toLocaleString('en-IN')}`}
            subtitle="Pending Outstanding Invoices"
            icon={Clock}
            colorScheme={summary.totalUnpaidRevenueINR > 0 ? 'amber' : 'emerald'}
            trend={summary.totalUnpaidRevenueINR > 0 ? 'Action Required' : 'No Pending Balance'}
            trendType={summary.totalUnpaidRevenueINR > 0 ? 'negative' : 'positive'}
          />
        </div>

        {/* Secondary Detailed Currency Metrics (USD, INR, Rate, Work Counts) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200/70 dark:border-slate-800 shadow-sm">
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Total USD</span>
            <p className="text-xl font-extrabold text-gray-900 dark:text-white mt-1">${summary.totalUSD.toLocaleString()}</p>
            <span className="text-[10px] text-gray-500 dark:text-gray-400">USD Earnings</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200/70 dark:border-slate-800 shadow-sm">
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Total INR</span>
            <p className="text-xl font-extrabold text-gray-900 dark:text-white mt-1">₹{summary.totalINR.toLocaleString('en-IN')}</p>
            <span className="text-[10px] text-gray-500 dark:text-gray-400">Direct INR Payments</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200/70 dark:border-slate-800 shadow-sm">
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Paid INR</span>
            <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">₹{summary.paidINR.toLocaleString('en-IN')}</p>
            <span className="text-[10px] text-gray-500 dark:text-gray-400">Cleared Payments</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200/70 dark:border-slate-800 shadow-sm">
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">USD to INR Rate</span>
            <p className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">₹{summary.usdToInrRate}</p>
            <span className="text-[10px] text-gray-500 dark:text-gray-400">Conversion Multiplier</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200/70 dark:border-slate-800 shadow-sm">
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">UVV Work Count</span>
            <p className="text-xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">{summary.uvvWorkCount}</p>
            <span className="text-[10px] text-gray-500 dark:text-gray-400">UVV Platform Tasks</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200/70 dark:border-slate-800 shadow-sm">
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Outside Work Count</span>
            <p className="text-xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">{summary.outsideWorkCount}</p>
            <span className="text-[10px] text-gray-500 dark:text-gray-400">External Client Projects</span>
          </div>
        </div>

        {/* Visual Charts Grid (Monthly Growth & Work Distribution) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Monthly Revenue Growth Chart (Line/Area) - Takes 2 Cols */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 shadow-sm">
            <GrowthChart
              data={growthData}
              selectedMonth={selectedMonth}
              onSelectMonth={(m) => setSelectedMonth(m)}
            />
          </div>

          {/* Work Distribution Pie Chart - Takes 1 Col */}
          <div className="lg:col-span-1 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 shadow-sm">
            <DistributionChart
              uvvCount={summary.uvvWorkCount}
              outsideCount={summary.outsideWorkCount}
            />
          </div>

        </div>

        {/* Currency Converter Section */}
        <CurrencyConverter
          rate={exchangeRate}
          onRateChange={(newRate) => setExchangeRate(newRate)}
        />

        {/* Full Transactions Log Table */}
        <TransactionsTable
          transactions={activeTransactions}
          onDeleteTransaction={handleDeleteTransaction}
          onEditTransaction={(tx) => {
            setEditingTransaction(tx);
            setIsModalOpen(true);
          }}
          onOpenAddModal={() => {
            setEditingTransaction(null);
            setIsModalOpen(true);
          }}
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
        editTransaction={editingTransaction}
        defaultExchangeRate={exchangeRate}
      />

    </div>
  );
}
