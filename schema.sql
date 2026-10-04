-- =========================================================
-- NAHYAN EARNING TRACKER - SUPABASE DATABASE SCHEMA
-- Execute this SQL in your Supabase SQL Editor
-- =========================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create User Profiles Table (extends Supabase auth.users)
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

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
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
  USING (auth.uid() = user_id OR auth.role() = 'anon');

-- 5. Automatic Profile Creation Trigger on Auth Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Insert Initial Seed Data Matching Nahyan's Freelance Dashboard
-- (Optional seed data for testing)
INSERT INTO public.transactions (title, type, source, currency, amount, exchange_rate, inr_amount, status, date, month, client_name)
VALUES
  ('UVV Web Development Milestone 1', 'income', 'UVV Work', 'USD', 800, 93, 74400, 'Paid', '2026-07-05', 'jul', 'UVV Client'),
  ('UVV API Integration & Auth', 'income', 'UVV Work', 'USD', 690, 93, 64170, 'Paid', '2026-07-12', 'jul', 'UVV Client'),
  ('UVV UI Polish & Mobile Layout', 'income', 'UVV Work', 'INR', 10000, 93, 10000, 'Paid', '2026-07-18', 'jul', 'UVV Client'),
  ('UVV Database Optimization', 'income', 'UVV Work', 'INR', 6000, 93, 6000, 'Paid', '2026-07-22', 'jul', 'UVV Client'),
  ('Jan UVV Contract', 'income', 'UVV Work', 'INR', 63545, 93, 63545, 'Paid', '2026-01-15', 'jan', 'UVV Client'),
  ('Apr Freelance Project', 'income', 'Outside Work', 'INR', 120755, 93, 120755, 'Paid', '2026-04-10', 'apr', 'Global Tech'),
  ('Dec Annual Retainer & Review', 'income', 'UVV Work', 'INR', 124160, 93, 124160, 'Paid', '2026-12-20', 'dec', 'UVV Client')
ON CONFLICT DO NOTHING;
