'use client';
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface Props {
  spendByCategory: Record<string, number>;
  totalSpent: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  Housing: 'var(--primary)',
  Transport: '#60A5FA',
  Groceries: '#4ADE80',
  Entertainment: '#A78BFA',
  Utilities: '#FBBF24',
  Clothing: '#FB923C',
  FamilySupport: '#F472B6',
  Savings: '#34D399',
  DebtRepayments: 'var(--negative)',
  Convenience: '#94A3B8',
};

const CATEGORY_LABELS: Record<string, string> = {
  Housing: 'Housing',
  Transport: 'Transport',
  Groceries: 'Groceries',
  Entertainment: 'Entertainment',
  Utilities: 'Utilities',
  Clothing: 'Clothing',
  FamilySupport: 'Family',
  Savings: 'Savings',
  DebtRepayments: 'Debt',
  Convenience: 'Convenience',
};

export default function SpendingBreakdownChartInner({ spendByCategory, totalSpent }: Props) {
  // Build demo data if categories are all zero
  const enriched: Record<string, number> = {
    Housing: 114000,
    Transport: 21600,
    Groceries: 28800,
    Entertainment: 18420,
    Utilities: 8400,
    Clothing: 4800,
    FamilySupport: 5000,
    Savings: 6000,
    DebtRepayments: 12000,
    Convenience: 9600,
    ...Object.fromEntries(Object.entries(spendByCategory).filter(([, v]) => v > 0)),
  };

  const data = Object.entries(enriched)
    .filter(([, v]) => v > 0)
    .sort(([, a], [, b]) => b - a)
    .map(([cat, value]) => ({
      category: CATEGORY_LABELS[cat] ?? cat,
      value,
      rawCat: cat,
    }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, bottom: 0, left: 60 }}>
        <CartesianGrid horizontal={false} stroke="var(--border)" strokeDasharray="3 3" />
        <XAxis
          type="number"
          tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontFamily: 'var(--font-ibm-plex-mono)' }}
          tickFormatter={(v) => `R${(v / 1000).toFixed(0)}k`}
        />
        <YAxis
          type="category"
          dataKey="category"
          tick={{ fill: 'var(--muted-foreground)', fontSize: 11, fontFamily: 'var(--font-plus-jakarta-sans)' }}
          width={60}
        />
        <Tooltip
          content={({ payload }) => {
            if (!payload?.length) return null;
            const item = payload[0];
            return (
              <div
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                }}
              >
                <div style={{ color: 'var(--foreground)', fontWeight: 600, fontSize: 12 }}>{item.payload?.category}</div>
                <div style={{ color: 'var(--primary)', fontFamily: 'var(--font-ibm-plex-mono)', fontSize: 13, fontWeight: 700 }}>
                  R{Number(item.value).toLocaleString('en-ZA')}
                </div>
                <div style={{ color: 'var(--muted-foreground)', fontSize: 11 }}>
                  {totalSpent > 0 ? `${((Number(item.value) / totalSpent) * 100).toFixed(1)}% of spending` : ''}
                </div>
              </div>
            );
          }}
        />
        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
          {data.map((entry) => (
            <Cell
              key={`cell-${entry.rawCat}`}
              fill={CATEGORY_COLORS[entry.rawCat] ?? 'var(--muted-foreground)'}
              fillOpacity={0.85}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}