'use client';
import React from 'react';
import dynamic from 'next/dynamic';

const SpendingBreakdownInner = dynamic(() => import('./SpendingBreakdownChartInner'), { ssr: false });

interface SpendingBreakdownChartProps {
  spendByCategory: Record<string, number>;
  totalSpent: number;
}

export default function SpendingBreakdownChart({ spendByCategory, totalSpent }: SpendingBreakdownChartProps) {
  return (
    <div className="card-surface rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <div className="text-xs font-600 text-primary uppercase tracking-wide mb-1">Spending Breakdown</div>
        <h3 className="text-base font-700 text-foreground">Where your money went</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Total: R{totalSpent.toLocaleString('en-ZA', { minimumFractionDigits: 0 })}</p>
      </div>
      <div className="p-4">
        <SpendingBreakdownInner spendByCategory={spendByCategory} totalSpent={totalSpent} />
      </div>
    </div>
  );
}