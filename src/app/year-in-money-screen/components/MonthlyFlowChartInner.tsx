'use client';
import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { MonthSummary } from '@/services/types';

interface Props {
  monthlyBreakdown: MonthSummary[];
}

export default function MonthlyFlowChartInner({ monthlyBreakdown }: Props) {
  // Realistic demo data showing variance — not smooth upward trend
  const demoData = [
    { label: 'Oct', available: 12840 },
    { label: 'Nov', available: 8240 },
    { label: 'Dec', available: 6180 },
    { label: 'Jan', available: 4950 },
    { label: 'Feb', available: 7320 },
    { label: 'Mar', available: 2180 },
    { label: 'Apr', available: 5640 },
    { label: 'May', available: 8910 },
    { label: 'Jun', available: 3420 },
    { label: 'Jul', available: 6750 },
    { label: 'Aug', available: 9280 },
    { label: 'Sep', available: 7140 },
  ];

  const data = monthlyBreakdown.length > 0 && monthlyBreakdown.some(m => m.availableAtEnd > 0)
    ? monthlyBreakdown.map(m => ({ label: m.label, available: m.availableAtEnd }))
    : demoData;

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="availableGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis
          dataKey="label"
          tick={{ fill: 'var(--muted-foreground)', fontSize: 11, fontFamily: 'var(--font-plus-jakarta-sans)' }}
        />
        <YAxis
          tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontFamily: 'var(--font-ibm-plex-mono)' }}
          tickFormatter={(v) => `R${(v / 1000).toFixed(0)}k`}
          width={40}
        />
        <Tooltip
          content={({ payload, label }) => {
            if (!payload?.length) return null;
            return (
              <div
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                }}
              >
                <div style={{ color: 'var(--muted-foreground)', fontSize: 11 }}>{label}</div>
                <div style={{ color: 'var(--primary)', fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 14, fontWeight: 700 }}>
                  R{Number(payload[0]?.value).toLocaleString('en-ZA')} available
                </div>
              </div>
            );
          }}
        />
        <Area
          type="monotone"
          dataKey="available"
          stroke="var(--primary)"
          strokeWidth={2}
          fill="url(#availableGrad)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}