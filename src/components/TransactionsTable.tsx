'use client';

import React, { useState } from 'react';
import { Transaction, PaymentStatus } from '@/lib/types';
import { 
  Search, 
  Trash2, 
  Edit3, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CheckCircle2, 
  Clock,
  Film,
  Sparkles,
  Layers,
  Wrench
} from 'lucide-react';

interface TransactionsTableProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
  onEditTransaction: (transaction: Transaction) => void;
  onOpenAddModal: () => void;
  onToggleStatus?: (id: string) => void;
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  onDeleteTransaction,
  onEditTransaction,
  onOpenAddModal,
  onToggleStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedProjectCategory, setSelectedProjectCategory] = useState<string>('all');
  const [selectedMonthFilter, setSelectedMonthFilter] = useState<string>('all');

  const filtered = transactions.filter((tx) => {
    const matchesSearch =
      tx.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tx.client_name && tx.client_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (tx.deliverable && tx.deliverable.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (tx.notes && tx.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = 
      selectedType === 'all' || 
      (selectedType === 'unsettled' && tx.status === 'Unpaid') ||
      (selectedType === 'settled' && tx.status === 'Paid') ||
      tx.type === selectedType;
    const matchesCategory = selectedProjectCategory === 'all' || 
      tx.project_type === selectedProjectCategory ||
      (selectedProjectCategory === 'Short-form' && (tx.project_type === 'Short-form' || tx.project_type === '9:16 Short/Reel')) ||
      (selectedProjectCategory === 'Long-form' && (tx.project_type === 'Long-form' || tx.project_type === 'YouTube Longform' || tx.project_type === 'Brand Commercial' || tx.project_type === 'Doc / Narrative' || tx.project_type === 'Color Grade & Finishing')) ||
      tx.source === selectedProjectCategory;
    const matchesMonth = selectedMonthFilter === 'all' || tx.month.toLowerCase() === selectedMonthFilter.toLowerCase();

    return matchesSearch && matchesType && matchesCategory && matchesMonth;
  });

  return (
    <div className="studio-panel rounded-2xl overflow-hidden">
      
      {/* Table Header & Controls */}
      <div className="p-6 border-b border-neutral-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-heading font-semibold text-white tracking-tight flex items-center space-x-2">
                <span>Production & Overhead Ledger</span>
              </h3>
              <p className="text-xs text-neutral-400">
                Detailed record of project deliverables, client payouts, and gear expenses
              </p>
            </div>
          </div>

          <button
            onClick={onOpenAddModal}
            className="self-start sm:self-auto px-4 py-2 rounded-lg bg-white hover:bg-neutral-200 text-black font-semibold text-xs transition shadow-sm"
          >
            + Log Entry
          </button>
        </div>

        {/* Filters and Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              placeholder="Search title, client, format..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-white"
            />
          </div>

          {/* Month Filter */}
          <div className="relative">
            <select
              value={selectedMonthFilter}
              onChange={(e) => setSelectedMonthFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 focus:outline-none focus:border-white cursor-pointer"
            >
              <option value="all">ALL MONTHS (2026)</option>
              <option value="jul">JULY (CURRENT FOCUS)</option>
              <option value="jan">JANUARY</option>
              <option value="apr">APRIL</option>
              <option value="dec">DECEMBER</option>
            </select>
          </div>

          {/* Type / Settlement Filter */}
          <div className="relative">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 focus:outline-none focus:border-white cursor-pointer"
            >
              <option value="all">ALL TRANSACTIONS</option>
              <option value="unsettled">UNSETTLED PAYMENTS ONLY</option>
              <option value="settled">SETTLED PAYOUTS ONLY</option>
              <option value="income">CLIENT EARNINGS ONLY</option>
              <option value="expense">STUDIO OVERHEAD ONLY</option>
            </select>
          </div>

          {/* Format / Category Filter */}
          <div className="relative">
            <select
              value={selectedProjectCategory}
              onChange={(e) => setSelectedProjectCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 focus:outline-none focus:border-white cursor-pointer"
            >
              <option value="all">ALL FORMATS & TYPES</option>
              <option value="Short-form">SHORT-FORM</option>
              <option value="Long-form">LONG-FORM</option>
              <option value="Software & Tools">SOFTWARE & TOOLS</option>
              <option value="Operating Expense">GEAR & HARDWARE</option>
            </select>
          </div>

        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#141416] text-xs font-mono font-medium text-neutral-400 uppercase tracking-wider border-b border-neutral-800">
              <th className="py-3.5 px-5">Project & Notes</th>
              <th className="py-3.5 px-5">Format</th>
              <th className="py-3.5 px-5">Client</th>
              <th className="py-3.5 px-5">Fee</th>
              <th className="py-3.5 px-5">Status</th>
              <th className="py-3.5 px-5">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/80 text-xs">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-neutral-500 font-mono">
                  NO ENTRIES FOUND MATCHING CRITERIA.
                </td>
              </tr>
            ) : (
              filtered.map((tx) => {
                const isIncome = tx.type === 'income';
                return (
                  <tr
                    key={tx.id}
                    className="hover:bg-neutral-900/40 transition-colors"
                  >
                    {/* Title & Notes */}
                    <td className="py-4 px-5">
                      <div className="flex items-start space-x-3">
                        <div className="min-w-0 flex items-center h-full">
                          <button
                            onClick={() => onEditTransaction(tx)}
                            className="font-medium text-white truncate max-w-md lg:max-w-xl xl:max-w-2xl hover:text-emerald-400 hover:underline transition-all text-left focus:outline-none"
                            title="Edit transaction"
                          >
                            {tx.title}
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Format */}
                    <td className="py-4 px-5">
                      <div>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono bg-neutral-900 text-neutral-300 border border-neutral-800">
                          {tx.project_type === '9:16 Short/Reel' ? 'Short-form' :
                           (tx.project_type === 'YouTube Longform' || tx.project_type === 'Brand Commercial' || tx.project_type === 'Doc / Narrative') ? 'Long-form' :
                           (tx.project_type || tx.source)}
                        </span>
                      </div>
                    </td>

                    {/* Client */}
                    <td className="py-4 px-5">
                      <span className="text-neutral-300 truncate max-w-[150px] inline-block">
                        {tx.client_name || <span className="text-neutral-600">-</span>}
                      </span>
                    </td>

                    {/* Original Amount */}
                    <td className={`py-4 px-5 font-mono font-medium ${isIncome ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {isIncome ? '+' : '-'}
                      {tx.currency === 'USD' ? `$${tx.amount.toLocaleString()}` : `₹${tx.amount.toLocaleString()}`}
                      <span className={`ml-1 text-xs ${isIncome ? 'text-emerald-500/70' : 'text-rose-500/70'} font-mono`}>({tx.currency})</span>
                    </td>

                    {/* Payment Settlement Status - Animated Interactive Toggle */}
                    <td className="py-4 px-5">
                      <button
                        type="button"
                        onClick={() => onToggleStatus && onToggleStatus(tx.id)}
                        className={`inline-flex items-center space-x-2 px-2.5 py-1.5 rounded-full border transition-all duration-300 cursor-pointer active:scale-95 group ${
                          tx.status === 'Paid'
                            ? 'bg-neutral-900 border-neutral-700 text-white shadow-sm hover:border-neutral-500'
                            : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                        }`}
                        title="Click to toggle settlement status"
                      >
                        {/* Animated Track & Thumb */}
                        <div
                          className={`relative inline-flex h-4 w-7 shrink-0 rounded-full transition-colors duration-300 ease-in-out ${
                            tx.status === 'Paid' ? 'bg-white' : 'bg-neutral-800'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-3 w-3 m-0.5 transform rounded-full transition-transform duration-300 ease-in-out shadow-sm ${
                              tx.status === 'Paid'
                                ? 'translate-x-3 bg-black'
                                : 'translate-x-0 bg-neutral-400'
                            }`}
                          />
                        </div>
                        <span className="text-xs font-mono font-medium select-none">
                          {tx.status === 'Paid' ? 'Settled' : 'Unsettled'}
                        </span>
                      </button>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-5 text-neutral-400 font-mono text-xs">
                      {(() => {
                        const parts = tx.date.split('-');
                        if (parts.length === 3) return `${parts[2]}/${parts[1]}`;
                        return tx.date;
                      })()}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
