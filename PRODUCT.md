# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Freelance Video Editors, Post-Production Specialists, Motion Designers, and Colorists managing high-volume client projects, YouTube creator retainers, commercial cuts, and international client billings with multi-currency payouts.

## Product Purpose

A dedicated financial and workflow cockpit engineered specifically for freelance video editors. It unifies project milestone tracking (Rough Cut, Client Revisions, Final Master Delivery), dual-currency earnings (USD client retainers converting to domestic currency like INR), gear and subscription overhead deductions (Adobe CC, DaVinci Studio, plugins, cloud render/storage, cameras), invoice generation, and tax forecasting. Success means the video editor never needs another spreadsheet or generic finance app: their entire creative business is visible with studio-grade precision.

## Positioning

The ultimate financial cockpit for post-production freelancers—marrying the dark-mode precision, clip milestone rhythm, and color-accurate aesthetic of professional video editing suites (DaVinci Resolve, Premiere Pro) with uncompromising multi-tenant financial intelligence, automated currency conversion, and contract tracking.

## Operating Context

Web browser on desktop editing workstations (multi-monitor setups, color-accurate displays) and mobile on the go. Used between editing sprints, during client cut reviews, milestone deliveries, monthly retainer cycles, and tax filing periods.

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
