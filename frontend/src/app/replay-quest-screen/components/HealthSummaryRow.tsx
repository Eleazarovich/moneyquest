import React from 'react';
import type { FinancialHealthSnapshot, HealthState } from '@/services/types';

interface HealthSummaryRowProps {
  health: FinancialHealthSnapshot;
}

const STATE_COLOR: Record<HealthState, string> = {
  Strong: 'text-positive bg-positive/10 border-positive/25',
  Healthy: 'text-green-400 bg-green-400/10 border-green-400/25',
  Stable: 'text-blue-400 bg-blue-400/10 border-blue-400/25',
  Building: 'text-warning bg-warning/10 border-warning/25',
  Vulnerable: 'text-orange-400 bg-orange-400/10 border-orange-400/25',
  Critical: 'text-negative bg-negative/10 border-negative/25',
};

export default function HealthSummaryRow({ health }: HealthSummaryRowProps) {
  const dimensions = [
    { id: 'hsr-resilience', label: 'Resilience', state: health.resilience.state, icon: '🛡️' },
    { id: 'hsr-liquidity', label: 'Liquidity', state: health.liquidity.state, icon: '💧' },
    { id: 'hsr-debt', label: 'Debt Load', state: health.debtLoad.state, icon: '⛓️' },
    { id: 'hsr-saving', label: 'Saving Habit', state: health.savingHabit.state, icon: '🌱' },
    { id: 'hsr-lifestyle', label: 'Lifestyle', state: health.lifestyleBalance.state, icon: '⚖️' },
  ];

  return (
    <div className="card-surface rounded-2xl p-5">
      <div className="text-sm font-700 text-foreground mb-4">Final Financial Health</div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {dimensions.map(d => (
          <div key={d.id} className="text-center">
            <div className="text-xl mb-1">{d.icon}</div>
            <div className="text-xs text-muted-foreground mb-1">{d.label}</div>
            <div className={`text-xs font-700 px-2 py-1 rounded-full border inline-block ${STATE_COLOR[d.state]}`}>
              {d.state}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}