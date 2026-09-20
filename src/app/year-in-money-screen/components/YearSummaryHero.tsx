import React from 'react';
import type { YearInMoneySummary } from '@/services/types';

interface YearSummaryHeroProps {
  summary: YearInMoneySummary;
}

export default function YearSummaryHero({ summary }: YearSummaryHeroProps) {
  const metrics = [
    { id: 'met-gross', label: 'Total Earned (Gross)', value: `R${summary.totalGrossIncome.toLocaleString('en-ZA')}`, sub: '12 months × R25,000', color: 'text-foreground', bg: 'bg-muted/30' },
    { id: 'met-net', label: 'Take-Home Received', value: `R${summary.totalNetIncome.toLocaleString('en-ZA', { minimumFractionDigits: 0 })}`, sub: 'After PAYE + UIF', color: 'text-positive', bg: 'bg-positive/5' },
    { id: 'met-saved', label: 'Amount Saved', value: `R${summary.totalSaved.toLocaleString('en-ZA')}`, sub: 'Emergency fund built', color: 'text-primary', bg: 'bg-primary/5' },
    { id: 'met-debt', label: 'Outstanding Debt', value: `R${summary.finalDebt.toLocaleString('en-ZA')}`, sub: summary.finalDebt > 0 ? 'Still being repaid' : 'Debt free 🎉', color: summary.finalDebt > 0 ? 'text-negative' : 'text-positive', bg: summary.finalDebt > 0 ? 'bg-negative/5' : 'bg-positive/5' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {metrics.map(m => (
        <div key={m.id} className={`card-surface rounded-2xl p-5 ${m.bg} border border-border`}>
          <div className="text-xs text-muted-foreground font-500 mb-2">{m.label}</div>
          <div className={`font-mono text-2xl font-700 ${m.color}`}>{m.value}</div>
          <div className="text-xs text-muted-foreground mt-1">{m.sub}</div>
        </div>
      ))}
    </div>
  );
}