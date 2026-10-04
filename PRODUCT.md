# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Freelancers, independent consultants, and contract professionals working with both domestic and international clients, requiring multi-tenant accounts, customizable currencies, and contract tracking.

## Product Purpose

A comprehensive freelance business management platform that enables freelancers to track income and expenses, generate professional invoices, estimate taxes, convert between international and local currencies (such as USD and INR), and manage client billing. Success means freelancers gain complete clarity over their net earnings, active client contracts, tax obligations, and receivables without relying on fragmented spreadsheets.

## Positioning

An integrated freelance financial cockpit designed specifically for cross-border and domestic contracting workflows—merging real-time exchange conversion, milestone and contract tracking, automated tax estimation, and client invoicing into one cohesive, multi-tenant application.

## Operating Context

Web browser on desktop and mobile. Used actively during contract milestone completions, monthly billing and invoicing cycles, expense logging, and quarterly or annual tax review periods.

## Capabilities and Constraints

- **Multi-Tenant Architecture**: User authentication and strictly isolated profiles and transactions enforced via Supabase Row Level Security (RLS).
- **Transaction & Contract Tracking**: Multi-source tracking (contract work, outside clients, operating expenses, software tools) with dual currency calculations and status tags (Paid, Unpaid).
- **Invoicing & Billing**: Invoice generation and client billing capabilities.
- **Tax Estimation**: Estimated tax liability calculations based on income brackets and business expense deductions.
- **Currency Intelligence**: Real-time and configurable exchange rates (e.g., USD/INR) with automatic domestic currency conversions.
- **Visual Analytics**: Monthly growth trajectories, category distribution breakdowns, and client revenue attribution.
- **Technical Stack**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Supabase (PostgreSQL with RLS), Recharts, Framer Motion.

## Brand Commitments

- **Name**: Nahyan Earning Tracker (expanding to a full freelance SaaS suite).
- **Tone**: Professional, crisp, modern, and trustworthy.

## Evidence on Hand

- Database architecture and RLS policies defined in [schema.sql](file:///c:/Users/syedf/Desktop/Saas/Nahyan%20Earning%20Tracker/schema.sql).
- Historical financial data model and reference records in [Nahyan personel dashboard - Data.pdf](file:///c:/Users/syedf/Desktop/Saas/Nahyan%20Earning%20Tracker/Nahyan%20personel%20dashboard%20-%20Data.pdf).
- Existing Next.js frontend implementation in [src/](file:///c:/Users/syedf/Desktop/Saas/Nahyan%20Earning%20Tracker/src).

## Product Principles

- **Financial Clarity**: Numbers, fees, and currency conversions must be precise, unambiguous, and immediately legible.
- **Frictionless Capture**: Recording an invoice, milestone payment, or expense must be fast and intuitive.
- **Rigorous Data Isolation**: Multi-tenant data segregation must be preserved at every layer from UI to database policies.
- **Transparent Forecasting**: Taxes, exchange rates, and cash-flow projections must provide actionable insights rather than black-box estimates.
