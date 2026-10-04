import { Transaction, MonthlyRevenue } from './types';

export const INITIAL_EXCHANGE_RATE = 93;

export const INITIAL_TRANSACTIONS: Transaction[] = [
  // July Transactions (Matching exact totals: USD $1,490 + INR ₹16,000 = ₹154,570 at rate 93)
  {
    id: 'tx-jul-1',
    title: 'UVV Web Development Milestone 1',
    type: 'income',
    source: 'UVV Work',
    currency: 'USD',
    amount: 800,
    exchange_rate: 93,
    inr_amount: 74400,
    status: 'Paid',
    date: '2026-07-05',
    month: 'jul',
    client_name: 'UVV Client',
    notes: 'Frontend & Supabase setup'
  },
  {
    id: 'tx-jul-2',
    title: 'UVV API Integration & Auth',
    type: 'income',
    source: 'UVV Work',
    currency: 'USD',
    amount: 690,
    exchange_rate: 93,
    inr_amount: 64170,
    status: 'Paid',
    date: '2026-07-12',
    month: 'jul',
    client_name: 'UVV Client',
    notes: 'Auth flows & endpoint security'
  },
  {
    id: 'tx-jul-3',
    title: 'UVV UI Polish & Mobile Layout',
    type: 'income',
    source: 'UVV Work',
    currency: 'INR',
    amount: 10000,
    exchange_rate: 93,
    inr_amount: 10000,
    status: 'Paid',
    date: '2026-07-18',
    month: 'jul',
    client_name: 'UVV Client',
    notes: 'Responsive UI enhancements'
  },
  {
    id: 'tx-jul-4',
    title: 'UVV Database Optimization',
    type: 'income',
    source: 'UVV Work',
    currency: 'INR',
    amount: 6000,
    exchange_rate: 93,
    inr_amount: 6000,
    status: 'Paid',
    date: '2026-07-22',
    month: 'jul',
    client_name: 'UVV Client',
    notes: 'Supabase RLS & indexing'
  },
  {
    id: 'tx-jul-5',
    title: 'Outside Client - Landing Page Design',
    type: 'income',
    source: 'Outside Work',
    currency: 'INR',
    amount: 0,
    exchange_rate: 93,
    inr_amount: 0,
    status: 'Paid',
    date: '2026-07-25',
    month: 'jul',
    client_name: 'Apex Studio',
    notes: 'Design consultation'
  },
  {
    id: 'tx-jul-6',
    title: 'Outside Client - Maintenance Contract',
    type: 'income',
    source: 'Outside Work',
    currency: 'INR',
    amount: 0,
    exchange_rate: 93,
    inr_amount: 0,
    status: 'Paid',
    date: '2026-07-28',
    month: 'jul',
    client_name: 'TechCorp',
    notes: 'Monthly retainer'
  },

  // Jan Transactions
  {
    id: 'tx-jan-1',
    title: 'Jan UVV Contract',
    type: 'income',
    source: 'UVV Work',
    currency: 'INR',
    amount: 63545,
    exchange_rate: 93,
    inr_amount: 63545,
    status: 'Paid',
    date: '2026-01-15',
    month: 'jan',
    client_name: 'UVV Client'
  },

  // Apr Transactions
  {
    id: 'tx-apr-1',
    title: 'Apr Freelance Project',
    type: 'income',
    source: 'Outside Work',
    currency: 'INR',
    amount: 120755,
    exchange_rate: 93,
    inr_amount: 120755,
    status: 'Paid',
    date: '2026-04-10',
    month: 'apr',
    client_name: 'Global Tech'
  },

  // Dec Transactions
  {
    id: 'tx-dec-1',
    title: 'Dec Annual Retainer & Review',
    type: 'income',
    source: 'UVV Work',
    currency: 'INR',
    amount: 124160,
    exchange_rate: 93,
    inr_amount: 124160,
    status: 'Paid',
    date: '2026-12-20',
    month: 'dec',
    client_name: 'UVV Client'
  },

  // Sample Expenses
  {
    id: 'tx-exp-1',
    title: 'Vercel & Supabase Hosting',
    type: 'expense',
    source: 'Software & Tools',
    currency: 'USD',
    amount: 40,
    exchange_rate: 93,
    inr_amount: 3720,
    status: 'Paid',
    date: '2026-07-01',
    month: 'jul',
    notes: 'Cloud infrastructure'
  },
  {
    id: 'tx-exp-2',
    title: 'Figma & Developer Subscriptions',
    type: 'expense',
    source: 'Software & Tools',
    currency: 'USD',
    amount: 25,
    exchange_rate: 93,
    inr_amount: 2325,
    status: 'Paid',
    date: '2026-07-10',
    month: 'jul',
    notes: 'Design tools'
  }
];

export const MONTH_OPTIONS = [
  { value: 'all', label: 'All Months (2026)' },
  { value: 'jan', label: 'January' },
  { value: 'feb', label: 'February' },
  { value: 'mar', label: 'March' },
  { value: 'apr', label: 'April' },
  { value: 'may', label: 'May' },
  { value: 'jun', label: 'June' },
  { value: 'jul', label: 'July' },
  { value: 'aug', label: 'August' },
  { value: 'sep', label: 'September' },
  { value: 'oct', label: 'October' },
  { value: 'nov', label: 'November' },
  { value: 'dec', label: 'December' },
];
