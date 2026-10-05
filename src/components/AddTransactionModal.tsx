'use client';

import React, { useState, useEffect } from 'react';
import { Transaction, TransactionType, WorkSource, Currency, PaymentStatus } from '@/lib/types';
import { X, Film } from 'lucide-react';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tx: Partial<Transaction>) => void;
  onDelete?: (id: string) => void;
  editTransaction?: Transaction | null;
  defaultExchangeRate: number;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  editTransaction,
  defaultExchangeRate,
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<TransactionType>('income');
  const [source, setSource] = useState<WorkSource>('Outside Work');
  const [projectFormat, setProjectFormat] = useState<'Short-form' | 'Long-form'>('Short-form');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [amount, setAmount] = useState('');
  const [exchangeRate, setExchangeRate] = useState(defaultExchangeRate.toString());
  const [status, setStatus] = useState<PaymentStatus>('Paid');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [month, setMonth] = useState('jul');
  const [clientName, setClientName] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (editTransaction) {
      setTitle(editTransaction.title);
      setType(editTransaction.type);
      setSource(editTransaction.source);
      if (editTransaction.project_type === 'Short-form' || editTransaction.project_type === '9:16 Short/Reel') {
        setProjectFormat('Short-form');
      } else {
        setProjectFormat('Long-form');
      }
      setCurrency(editTransaction.currency);
      setAmount(editTransaction.amount.toString());
      setExchangeRate(editTransaction.exchange_rate.toString());
      setStatus(editTransaction.status);
      setDate(editTransaction.date || new Date().toISOString().split('T')[0]);
      setMonth(editTransaction.month || 'jul');
      setClientName(editTransaction.client_name || '');
      setNotes(editTransaction.notes || '');
    } else {
      setTitle('');
      setType('income');
      setSource('Outside Work');
      setProjectFormat('Short-form');
      setCurrency('USD');
      setAmount('');
      setExchangeRate(defaultExchangeRate.toString());
      setStatus('Paid');
      const todayStr = new Date().toISOString().split('T')[0];
      setDate(todayStr);
      const monthsList = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
      setMonth(monthsList[new Date().getMonth()] || 'jul');
      setClientName('');
      setNotes('');
    }
  }, [editTransaction, isOpen, defaultExchangeRate]);

  if (!isOpen) return null;

  const rateNum = parseFloat(exchangeRate) || defaultExchangeRate;
  const amountNum = parseFloat(amount) || 0;
  const calculatedInr = currency === 'USD' ? Math.round(amountNum * rateNum) : amountNum;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount || !date || !status) return;

    const dateObj = new Date(date);
    const monthsList = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    const resolvedMonth = !isNaN(dateObj.getTime()) ? monthsList[dateObj.getMonth()] : (month || 'jul');

    onSave({
      id: editTransaction ? editTransaction.id : `tx-${Date.now()}`,
      title,
      type,
      source: type === 'expense' ? source : 'Outside Work',
      project_type: type === 'income' ? projectFormat : undefined,
      currency,
      amount: amountNum,
      exchange_rate: rateNum,
      inr_amount: calculatedInr,
      status,
      date,
      month: resolvedMonth,
      client_name: clientName,
      notes,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-lg studio-panel rounded-2xl border border-neutral-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-heading font-semibold text-white tracking-tight">
                {editTransaction ? 'Edit Entry' : 'New Entry'}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[82vh] overflow-y-auto text-xs">
          
          {/* Type Selector Tabs: Earning & Expense */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-neutral-900 border border-neutral-800">
            <button
              type="button"
              onClick={() => setType('income')}
              className={`py-2 rounded-lg font-medium transition-all cursor-pointer ${
                type === 'income'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Earning
            </button>
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`py-2 rounded-lg font-medium transition-all cursor-pointer ${
                type === 'expense'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Expense
            </button>
          </div>

          {/* Title & Client */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                Project Name *
              </label>
              <input
                type="text"
                required
                placeholder="Project name..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                Client Name
              </label>
              <input
                type="text"
                placeholder="Client name..."
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-white"
              />
            </div>
          </div>

          {/* Format (Half) and Billing Date (Half) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Left Half: Video Format (for Earning) or Overhead Category (for Expense) */}
            {type === 'income' ? (
              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                  Video Format
                </label>
                <select
                  value={projectFormat}
                  onChange={(e) => setProjectFormat(e.target.value as 'Short-form' | 'Long-form')}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-white cursor-pointer"
                >
                  <option value="Short-form">Short-form (Reels, Shorts)</option>
                  <option value="Long-form">Long-form (YouTube, Doc)</option>
                </select>
              </div>
            ) : (
              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                  Overhead Category
                </label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value as WorkSource)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-white cursor-pointer"
                >
                  <option value="Software & Tools">Software & Plugins</option>
                  <option value="Operating Expense">Hardware & Gear</option>
                  <option value="Other">Other Studio Overhead</option>
                </select>
              </div>
            )}

            {/* Right Half: Billing Date */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                Billing Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  if (e.target.value) {
                    const dateObj = new Date(e.target.value);
                    if (!isNaN(dateObj.getTime())) {
                      const monthsList = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
                      setMonth(monthsList[dateObj.getMonth()]);
                    }
                  }
                }}
                className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-white cursor-pointer [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Currency & Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-white cursor-pointer"
              >
                <option value="USD">USD ($)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                Amount ({currency}) *
              </label>
              <input
                type="number"
                required
                step="any"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 font-mono font-semibold rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                USD/INR Rate
              </label>
              <input
                type="number"
                step="0.01"
                value={exchangeRate}
                onChange={(e) => setExchangeRate(e.target.value)}
                disabled={currency === 'INR'}
                className="w-full px-3 py-2 font-mono rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-white disabled:opacity-40"
              />
            </div>
          </div>

          {/* INR Calculation Preview */}
          <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
            <span className="text-neutral-400 font-mono text-xs">Converted INR Payout:</span>
            <span className="font-semibold text-sm text-white font-mono">
              ₹{calculatedInr.toLocaleString('en-IN')} INR
            </span>
          </div>

          {/* Settlement Status - Full Width with Left: Unsettled (Red), Right: Settled / Paid (Green) */}
          {type === 'income' && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                  Settlement Status *
                </label>
                <span className="text-[10px] font-mono text-neutral-500">Mandatory</span>
              </div>
              <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-neutral-900 border border-neutral-800">
                {/* Left Button: Unsettled */}
                <button
                  type="button"
                  onClick={() => setStatus('Unpaid')}
                  className={`py-2.5 px-4 rounded-lg font-medium text-xs transition-all duration-200 cursor-pointer flex items-center justify-center space-x-1.5 ${
                    status === 'Unpaid'
                      ? 'bg-white text-black shadow-sm font-semibold'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${status === 'Unpaid' ? 'bg-red-500' : 'bg-neutral-600'}`} />
                  <span>Unsettled</span>
                </button>

                {/* Right Button: Settled / Paid */}
                <button
                  type="button"
                  onClick={() => setStatus('Paid')}
                  className={`py-2.5 px-4 rounded-lg font-medium text-xs transition-all duration-200 cursor-pointer flex items-center justify-center space-x-1.5 ${
                    status === 'Paid'
                      ? 'bg-white text-black shadow-sm font-semibold'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${status === 'Paid' ? 'bg-emerald-500' : 'bg-neutral-600'}`} />
                  <span>Settled (Paid)</span>
                </button>
              </div>
            </div>
          )}

          {/* Project Notes - Simple Note Field for Project Details */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
              Project Notes
            </label>
            <textarea
              rows={3}
              placeholder="Add any notes or details about this project (e.g. revisions, deliverables, client feedback, links)..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-white resize-none"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
            <div>
              {editTransaction && onDelete && (
                <button
                  type="button"
                  onClick={() => {
                    onDelete(editTransaction.id);
                    onClose();
                  }}
                  className="px-4 py-2 rounded-lg text-rose-500 hover:text-white hover:bg-rose-500/20 transition cursor-pointer flex items-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-white hover:bg-neutral-200 text-black font-semibold transition shadow-sm cursor-pointer"
              >
                {editTransaction ? 'Save Changes' : 'Add Entry'}
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
