'use client';
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { WhatIfFork } from '@/services/types';

interface Props {
  fork: WhatIfFork;
}

export default function ComparisonChartInner({ fork }: Props) {
  const data = [
    {
      metric: 'Cash',
      yourYear: Math.max(0, fork.originalOutcome.finalCash),
      alternative: Math.max(0, fork.alternativeOutcome.finalCash),
    },
    {
      metric: 'Savings',
      yourYear: Math.max(0, fork.originalOutcome.finalSavings),
      alternative: Math.max(0, fork.alternativeOutcome.finalSavings),
    },
    {
      metric: 'Debt',
      yourYear: Math.max(0, fork.originalOutcome.finalDebt),
      alternative: Math.max(0, fork.alternativeOutcome.finalDebt),
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 0, right: 8, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis
          dataKey="metric"
          tick={{ fill: 'var(--muted-foreground)', fontSize: 12, fontFamily: 'var(--font-plus-jakarta-sans)' }}
        />
        <YAxis
          tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontFamily: 'var(--font-ibm-plex-mono)' }}
          tickFormatter={(v) => `R${(v / 1000).toFixed(0)}k`}
          width={44}
        />
        <Tooltip
          content={({ payload, label }) => {
            if (!payload?.length) return null;
            return (
              <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px' }}>
                <div style={{ color: 'var(--foreground)', fontWeight: 600, fontSize: 12, marginBottom: 4 }}>{label}</div>
                {payload.map((p) => (
                  <div key={`tt-${p.dataKey}`} style={{ color: p.color, fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 12 }}>
                    {p.name}: R{Number(p.value).toLocaleString('en-ZA')}
                  </div>
                ))}
              </div>
            );
          }}
        />
        <Legend
          wrapperStyle={{ fontSize: 12, fontFamily: 'var(--font-plus-jakarta-sans)', color: 'var(--muted-foreground)' }}
        />
        <Bar dataKey="yourYear" name="Your Year" fill="var(--negative)" fillOpacity={0.7} radius={[4, 4, 0, 0]} />
        <Bar dataKey="alternative" name="Alternative" fill="var(--positive)" fillOpacity={0.7} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}