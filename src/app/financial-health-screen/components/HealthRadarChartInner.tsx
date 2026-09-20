'use client';
import React from 'react';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { FinancialHealthSnapshot, HealthState } from '@/services/types';

const STATE_VALUE: Record<HealthState, number> = {
  Strong: 6,
  Healthy: 5,
  Stable: 4,
  Building: 3,
  Vulnerable: 2,
  Critical: 1,
};

interface Props {
  health: FinancialHealthSnapshot;
}

export default function HealthRadarChartInner({ health }: Props) {
  const data = [
    { dimension: 'Resilience', value: STATE_VALUE[health.resilience.state], fullMark: 6 },
    { dimension: 'Liquidity', value: STATE_VALUE[health.liquidity.state], fullMark: 6 },
    { dimension: 'Debt Load', value: STATE_VALUE[health.debtLoad.state], fullMark: 6 },
    { dimension: 'Saving', value: STATE_VALUE[health.savingHabit.state], fullMark: 6 },
    { dimension: 'Lifestyle', value: STATE_VALUE[health.lifestyleBalance.state], fullMark: 6 },
  ];

  return (
    <ResponsiveContainer width="100%" height={200}>
      <RadarChart data={data}>
        <PolarGrid stroke="var(--border)" />
        <PolarAngleAxis
          dataKey="dimension"
          tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontFamily: 'var(--font-plus-jakarta-sans)' }}
        />
        <Radar
          name="Health"
          dataKey="value"
          stroke="var(--primary)"
          fill="var(--primary)"
          fillOpacity={0.2}
          strokeWidth={2}
        />
        <Tooltip
          content={({ payload }) => {
            if (!payload?.length) return null;
            return (
              <div className="card-surface border border-border rounded-lg px-3 py-2 text-xs">
                <div className="font-600 text-foreground">{payload[0]?.payload?.dimension}</div>
                <div className="text-muted-foreground">Score: {payload[0]?.value}/6</div>
              </div>
            );
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}