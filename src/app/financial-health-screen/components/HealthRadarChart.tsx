'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import type { FinancialHealthSnapshot } from '@/services/types';

const RadarChartComponent = dynamic(() => import('./HealthRadarChartInner'), { ssr: false });

interface HealthRadarChartProps {
  health: FinancialHealthSnapshot;
}

export default function HealthRadarChart({ health }: HealthRadarChartProps) {
  return (
    <div className="card-surface rounded-2xl p-4">
      <div className="text-xs font-600 text-muted-foreground mb-3 text-center uppercase tracking-wide">Health Overview</div>
      <RadarChartComponent health={health} />
    </div>
  );
}