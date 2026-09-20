'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import type { MonthSummary } from '@/services/types';

const MonthlyFlowInner = dynamic(() => import('./MonthlyFlowChartInner'), { ssr: false });

interface MonthlyFlowChartProps {
  monthlyBreakdown: MonthSummary[];
}

export default function MonthlyFlowChart({ monthlyBreakdown }: MonthlyFlowChartProps) {
  return (
    <div className="card-surface rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <div className="text-xs font-600 text-accent uppercase tracking-wide mb-1">Monthly Cash Flow</div>
        <h3 className="text-base font-700 text-foreground">How your available cash moved across the year</h3>
      </div>
      <div className="p-4">
        <MonthlyFlowInner monthlyBreakdown={monthlyBreakdown} />
      </div>
    </div>
  );
}