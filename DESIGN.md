---
name: Nahyan Earning Tracker
description: An integrated freelance financial cockpit
colors:
  electric-azure: '#0c92eb'
  emerald-success: '#10b981'
  rose-destructive: '#f43f5e'
  background-light: 'hsl(210, 40%, 98%)'
  background-dark: 'hsl(224, 71%, 4%)'
typography:
  display:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  headline:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  title:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  body:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  label:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
rounded:
  base: '0.75rem'
components:
  glass-panel:
    blur: '12px'
    border: '1px solid rgba(229, 231, 235, 0.8)'
    background: 'rgba(255, 255, 255, 0.85)'
---

# Design System: Nahyan Earning Tracker

## Overview

**Creative North Star: "The Financial Cockpit"**

The system is crisp, transparent, and effortlessly modern. It focuses on absolute financial clarity and trust, leveraging glassmorphism against deep, contrasting backgrounds. The interface feels airy yet highly technical, ensuring that freelance earnings, multi-currency transactions, and contract tracking are immediately legible and never overwhelming.

**Key Characteristics:**
- Uncluttered, high-contrast typography prioritizing legibility.
- Glassmorphic panels that provide tactile depth without heavy shadows.
- Vibrant, deliberate color accents to indicate status and primary actions.

## Colors

The palette is anchored by an optimistic blue, supported by crisp utilitarian neutrals and clear semantic indicators.

### Primary
- **Electric Azure** (#0c92eb / HSL 221.2 83.2% 53.3%): A vibrant, optimistic blue that signals forward momentum and clarity. Used for primary actions, active navigation states, and focus rings.

### Semantic
- **Emerald Success** (#10b981): Indicates positive growth, paid invoices, and successful operations.
- **Rose Destructive** (#f43f5e): Indicates negative trends, unpaid or overdue invoices, and destructive actions.

### Neutral
- **Background Light** (HSL 210 40% 98%): A slightly cool, off-white canvas that reduces eye strain.
- **Background Dark** (HSL 224 71% 4%): A deep, immersive indigo-black canvas for focused dark-mode work.
- **Surface Panels** (Glassmorphic): Semi-transparent white/dark layers that float above the canvas.

## Typography

**Display Font:** System UI Stack (system-ui, -apple-system, Roboto, sans-serif)
**Body Font:** System UI Stack

**Character:** Utilitarian, native, and instantly recognizable. Relies on the operating system's optimized typography for maximum performance and readability across devices.

### Hierarchy
- **Display** (Bold): Major dashboard metrics, total balances, and hero headers.
- **Headline** (Semibold): Page titles and modal headers.
- **Title** (Medium): Card titles and distinct section dividers.
- **Body** (Regular): Transaction details, client names, and general text.
- **Label** (Medium, small): Microcopy, table headers, and status badges.

## Layout

The spatial model relies on distinct, separated cards (glass panels) resting on a solid canvas. Spacing is generous to allow data to breathe. Components utilize a standard `0.75rem` border radius to maintain a friendly yet professional structure.

## Elevation & Depth

Tactile Glassmorphism. Surfaces float using translucent glass effects (12px blur) rather than traditional opaque shadows.

### Shadow Vocabulary
- **Glass Panel (Light)**: `background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(12px); border: 1px solid rgba(229, 231, 235, 0.8);`
- **Glass Panel (Dark)**: `background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.08);`

**The Flat-By-Default Rule.** The underlying canvas is strictly flat. Depth is only achieved through the physical transparency (backdrop-filter) of surface panels layered above it, creating an airy, modern feel without visual clutter.
