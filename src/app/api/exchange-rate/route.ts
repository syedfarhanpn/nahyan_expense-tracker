import { NextResponse } from 'next/server';

export const revalidate = 1800; // Cache for 30 minutes

export async function GET() {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD', {
      next: { revalidate: 1800 },
    });

    if (!res.ok) {
      throw new Error(`Primary API returned status ${res.status}`);
    }

    const data = await res.json();
    const inrRate = data.rates?.INR;

    if (typeof inrRate === 'number' && inrRate > 0) {
      return NextResponse.json({
        rate: Number(inrRate.toFixed(2)),
        currency: 'INR',
        base: 'USD',
        updatedAt: data.time_last_update_utc || new Date().toISOString(),
        dateText: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        isLive: true,
      });
    }

    throw new Error('Invalid rate received');
  } catch (error) {
    // Try secondary fallback API
    try {
      const fallbackRes = await fetch('https://api.exchangerate-api.com/v4/latest/USD', {
        next: { revalidate: 1800 },
      });
      if (fallbackRes.ok) {
        const fallbackData = await fallbackRes.json();
        const inrRate = fallbackData.rates?.INR;
        if (typeof inrRate === 'number' && inrRate > 0) {
          return NextResponse.json({
            rate: Number(inrRate.toFixed(2)),
            currency: 'INR',
            base: 'USD',
            updatedAt: fallbackData.date || new Date().toISOString(),
            dateText: new Date().toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }),
            isLive: true,
          });
        }
      }
    } catch {
      // Ignore fallback error
    }

    // Default safe fallback if network is offline
    return NextResponse.json({
      rate: 86.85,
      currency: 'INR',
      base: 'USD',
      updatedAt: new Date().toISOString(),
      dateText: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      isLive: false,
    });
  }
}
