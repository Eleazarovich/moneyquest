'use client';
import React from 'react';
import type { WhatIfFork } from '@/services/types';
import dynamic from 'next/dynamic';

const ComparisonChartInner = dynamic(() => import('./ComparisonChartInner'), { ssr: false });

interface ComparisonPanelProps {
  fork: WhatIfFork;
}

interface MetricRow {
  id: string;
  label: string;
  original: string;
  alternative: string;
  originalRaw: number;
  alternativeRaw: number;
  higherIsBetter: boolean;
}

export default function ComparisonPanel({ fork }: ComparisonPanelProps) {
  const metrics: MetricRow[] = [
    {
      id: 'met-cash',
      label: 'Final Available Cash',
      original: `R${fork.originalOutcome.finalCash.toLocaleString('en-ZA', { minimumFractionDigits: 0 })}`,
      alternative: `R${fork.alternativeOutcome.finalCash.toLocaleString('en-ZA', { minimumFractionDigits: 0 })}`,
      originalRaw: fork.originalOutcome.finalCash,
      alternativeRaw: fork.alternativeOutcome.finalCash,
      higherIsBetter: true,
    },
    {
      id: 'met-savings',
      label: 'Total Savings Built',
      original: `R${fork.originalOutcome.finalSavings.toLocaleString('en-ZA')}`,
      alternative: `R${fork.alternativeOutcome.finalSavings.toLocaleString('en-ZA')}`,
      originalRaw: fork.originalOutcome.finalSavings,
      alternativeRaw: fork.alternativeOutcome.finalSavings,
      higherIsBetter: true,
    },
    {
      id: 'met-debt',
      label: 'Outstanding Debt',
      original: `R${fork.originalOutcome.finalDebt.toLocaleString('en-ZA')}`,
      alternative: `R${fork.alternativeOutcome.finalDebt.toLocaleString('en-ZA')}`,
      originalRaw: fork.originalOutcome.finalDebt,
      alternativeRaw: fork.alternativeOutcome.finalDebt,
      higherIsBetter: false,
    },
    {
      id: 'met-monthly',
      label: 'Monthly Available',
      original: `R${fork.originalOutcome.monthlyAvailable.toLocaleString('en-ZA', { minimumFractionDigits: 0 })}`,
      alternative: `R${fork.alternativeOutcome.monthlyAvailable.toLocaleString('en-ZA', { minimumFractionDigits: 0 })}`,
      originalRaw: fork.originalOutcome.monthlyAvailable,
      alternativeRaw: fork.alternativeOutcome.monthlyAvailable,
      higherIsBetter: true,
    },
    {
      id: 'met-emergency',
      label: 'Emergency Coverage',
      original: `${fork.originalOutcome.emergencyCoverage.toFixed(1)} months`,
      alternative: `${fork.alternativeOutcome.emergencyCoverage.toFixed(1)} months`,
      originalRaw: fork.originalOutcome.emergencyCoverage,
      alternativeRaw: fork.alternativeOutcome.emergencyCoverage,
      higherIsBetter: true,
    },
    {
      id: 'met-debtfree',
      label: 'Debt Free at Year End',
      original: fork.originalOutcome.debtFree ? 'Yes ✓' : 'No ✗',
      alternative: fork.alternativeOutcome.debtFree ? 'Yes ✓' : 'No ✗',
      originalRaw: fork.originalOutcome.debtFree ? 1 : 0,
      alternativeRaw: fork.alternativeOutcome.debtFree ? 1 : 0,
      higherIsBetter: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card-surface rounded-2xl p-5 border-l-4 border-negative">
          <div className="text-xs font-600 text-negative uppercase tracking-wide mb-2">Your Year</div>
          <h3 className="text-base font-700 text-foreground">{fork.originalChoice}</h3>
          <p className="text-xs text-muted-foreground mt-1">The path you took from Month {fork.forkMonth}</p>
        </div>
        <div className="card-surface rounded-2xl p-5 border-l-4 border-positive">
          <div className="text-xs font-600 text-positive uppercase tracking-wide mb-2">Alternative Year</div>
          <h3 className="text-base font-700 text-foreground">{fork.alternativeChoice}</h3>
          <p className="text-xs text-muted-foreground mt-1">What could have been from Month {fork.forkMonth}</p>
        </div>
      </div>

      {/* Metric comparison table */}
      <div className="card-surface rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-base font-700 text-foreground">Side-by-Side Comparison</h3>
          <p className="text-xs text-muted-foreground mt-0.5">End-of-year financial outcome at Month 12</p>
        </div>

        <div className="divide-y divide-border">
          <div className="grid grid-cols-3 px-5 py-2 text-xs font-600 text-muted-foreground uppercase tracking-wide">
            <span>Metric</span>
            <span className="text-center text-negative">Your Year</span>
            <span className="text-center text-positive">Alternative</span>
          </div>
          {metrics.map(m => {
            const altIsBetter = m.higherIsBetter
              ? m.alternativeRaw > m.originalRaw
              : m.alternativeRaw < m.originalRaw;
            const delta = m.alternativeRaw - m.originalRaw;
            const deltaStr = Math.abs(delta) > 0.01
              ? `${delta > 0 ? '+' : ''}${typeof m.originalRaw === 'number' && m.originalRaw > 10
                ? `R${Math.abs(delta).toLocaleString('en-ZA', { minimumFractionDigits: 0 })}`
                : Math.abs(delta).toFixed(1)}`
              : 'Same';

            return (
              <div key={m.id} className="grid grid-cols-3 px-5 py-3 items-center hover:bg-muted/20 transition-all">
                <span className="text-sm text-foreground font-500">{m.label}</span>
                <span className="text-center font-mono text-sm text-muted-foreground">{m.original}</span>
                <div className="text-center">
                  <span className={`font-mono text-sm font-600 ${altIsBetter ? 'text-positive' : m.alternativeRaw === m.originalRaw ? 'text-muted-foreground' : 'text-negative'}`}>
                    {m.alternative}
                  </span>
                  {deltaStr !== 'Same' && (
                    <div className={`text-xs mt-0.5 ${altIsBetter ? 'text-positive' : 'text-negative'}`}>
                      {altIsBetter ? '↑' : '↓'} {deltaStr}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chart comparison */}
      <div className="card-surface rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-base font-700 text-foreground">Outcome Comparison</h3>
        </div>
        <div className="p-4">
          <ComparisonChartInner fork={fork} />
        </div>
      </div>

      {/* Narrative */}
      <div className="card-surface rounded-2xl p-6 bg-accent/5 border-accent/20">
        <div className="text-xs font-600 text-accent uppercase tracking-wide mb-2">The Insight</div>
        <p className="text-base text-foreground leading-relaxed">
          {fork.id === 'fork-apartment' && "One housing decision, made in Month 1, shaped the entire year. The R${(fork.alternativeOutcome.finalSavings - fork.originalOutcome.finalSavings).toLocaleString()} difference in savings came from a single choice about where to live."}
          {fork.id === 'fork-phone' && "A phone contract feels like a small monthly commitment. Across the year, the difference between upgrading and not upgrading is visible in your final cash position and debt load."}
          {fork.id === 'fork-savings' && "R1,000 a month feels like a sacrifice. By Month 12, it becomes R12,000 in emergency savings — and the difference between being resilient and being exposed to the next unexpected expense."}
        </p>
      </div>
    </div>
  );
}