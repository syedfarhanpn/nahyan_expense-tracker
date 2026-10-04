export type TransactionType = 'income' | 'expense';

export type WorkSource = 'UVV Work' | 'Outside Work' | 'Operating Expense' | 'Software & Tools' | 'Other';

export type PaymentStatus = 'Paid' | 'Unpaid';

export type Currency = 'USD' | 'INR';

export interface Transaction {
  id: string;
  user_id?: string;
  title: string;
  type: TransactionType;
  source: WorkSource;
  currency: Currency;
  amount: number; // Original amount in specified currency
  exchange_rate: number; // Rate at transaction time (e.g. 93)
  inr_amount: number; // Calculated INR amount
  status: PaymentStatus;
  date: string; // ISO date format "YYYY-MM-DD"
  month: string; // "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"
  client_name?: string;
  notes?: string;
  created_at?: string;
}

export interface MonthlyRevenue {
  month: string;
  label: string;
  revenue: number;
  expenses: number;
  net: number;
  paid: number;
  unpaid: number;
}

export interface WorkDistribution {
  name: string;
  value: number;
  count: number;
  color: string;
}

export interface DashboardSummary {
  selectedMonth: string;
  usdToInrRate: number;
  totalUSD: number;
  totalINR: number;
  paidINR: number;
  unpaidINR: number;
  totalRevenueINR: number;
  totalPaidRevenueINR: number;
  totalUnpaidRevenueINR: number;
  totalExpensesINR: number;
  netProfitINR: number;
  uvvWorkCount: number;
  outsideWorkCount: number;
}
