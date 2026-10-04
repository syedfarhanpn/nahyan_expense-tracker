'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Database, Copy, Check, Terminal, ShieldAlert, Sparkles } from 'lucide-react';

export default function SchemaPage() {
  const [copied, setCopied] = useState(false);

  const sqlCode = `-- =========================================================
-- NAHYAN EARNING TRACKER - SUPABASE DATABASE SCHEMA
-- Execute this SQL in your Supabase SQL Editor
-- =========================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create User Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT UNIQUE NOT NULL,
  default_currency TEXT DEFAULT 'USD',
  default_exchange_rate NUMERIC DEFAULT 93.0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Transactions Table
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  source TEXT NOT NULL CHECK (source IN ('UVV Work', 'Outside Work', 'Operating Expense', 'Software & Tools', 'Other')),
  currency TEXT NOT NULL CHECK (currency IN ('USD', 'INR')),
  amount NUMERIC NOT NULL,
  exchange_rate NUMERIC NOT NULL DEFAULT 93.0,
  inr_amount NUMERIC NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Paid', 'Unpaid')),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  month TEXT NOT NULL,
  client_name TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

-- RLS Policies for Transactions
CREATE POLICY "Users can view their own transactions" 
  ON public.transactions FOR SELECT 
  USING (auth.uid() = user_id OR auth.role() = 'anon');

CREATE POLICY "Users can insert their own transactions" 
  ON public.transactions FOR INSERT 
  WITH CHECK (auth.uid() = user_id OR auth.role() = 'anon');

CREATE POLICY "Users can update their own transactions" 
  ON public.transactions FOR UPDATE 
  USING (auth.uid() = user_id OR auth.role() = 'anon');

CREATE POLICY "Users can delete their own transactions" 
  ON public.transactions FOR DELETE 
  USING (auth.uid() = user_id OR auth.role() = 'anon');`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 shadow-sm">
          <div>
            <div className="flex items-center space-x-2">
              <Database className="w-6 h-6 text-brand-600 dark:text-brand-400" />
              <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                Supabase SQL Database Setup
              </h1>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Run this schema in your Supabase SQL Editor to initialize tables, row-level security, and triggers.
            </p>
          </div>

          <button
            onClick={copyToClipboard}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md transition"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy SQL Schema'}</span>
          </button>
        </div>

        {/* Steps Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-emerald-500" />
            <span>How to connect your Supabase DB:</span>
          </h3>

          <ol className="list-decimal list-inside text-xs space-y-2 text-gray-600 dark:text-gray-300">
            <li>
              Go to your <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="text-brand-600 dark:text-brand-400 font-bold underline">Supabase Dashboard</a> and create a new project.
            </li>
            <li>
              Navigate to <strong>SQL Editor</strong> on the left sidebar.
            </li>
            <li>
              Click <strong>+ New Query</strong>, paste the copied SQL below, and click <strong>Run</strong>.
            </li>
            <li>
              Copy your <code>Project URL</code> and <code>anon public key</code> into your <code>.env.local</code> file:
              <pre className="mt-2 p-3 rounded-xl bg-gray-100 dark:bg-slate-800 font-mono text-[11px] text-gray-800 dark:text-gray-200 overflow-x-auto">
{`NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key`}
              </pre>
            </li>
          </ol>
        </div>

        {/* Code View */}
        <div className="rounded-3xl bg-slate-900 text-slate-100 border border-slate-800 shadow-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-3 bg-slate-800/80 border-b border-slate-700">
            <span className="text-xs font-mono text-slate-400">schema.sql</span>
            <button
              onClick={copyToClipboard}
              className="text-xs text-brand-400 font-semibold hover:underline flex items-center space-x-1"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre className="p-6 font-mono text-xs overflow-x-auto leading-relaxed text-slate-300">
            {sqlCode}
          </pre>
        </div>

      </main>
    </div>
  );
}
