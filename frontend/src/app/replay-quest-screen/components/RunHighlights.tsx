import React from 'react';
import type { PlayerState } from '@/services/types';

interface RunHighlightsProps {
  playerState: PlayerState;
}

export default function RunHighlights({ playerState }: RunHighlightsProps) {
  const totalDebt = playerState.debts.reduce((s, d) => s + d.balance, 0);
  const totalCommitted = playerState.recurringCommitments.filter(c => c.active).reduce((s, c) => s + c.amount, 0);

  const highlights = [
    {
      id: 'hl-cash',
      label: 'Ended with',
      value: `R${playerState.availableCash.toLocaleString('en-ZA', { minimumFractionDigits: 0 })}`,
      sub: 'Available cash',
      color: playerState.availableCash > 5000 ? 'text-positive' : playerState.availableCash > 1000 ? 'text-warning' : 'text-negative',
      emoji: '💰',
    },
    {
      id: 'hl-savings',
      label: 'Saved total',
      value: `R${playerState.totalSavings.toLocaleString('en-ZA')}`,
      sub: `${playerState.monthsWithSavings} months with savings`,
      color: playerState.totalSavings > 5000 ? 'text-positive' : playerState.totalSavings > 0 ? 'text-warning' : 'text-muted-foreground',
      emoji: '🛡️',
    },
    {
      id: 'hl-debt',
      label: 'Outstanding debt',
      value: totalDebt > 0 ? `R${totalDebt.toLocaleString('en-ZA')}` : 'Debt free',
      sub: totalDebt > 0 ? `${playerState.debts.length} account${playerState.debts.length !== 1 ? 's' : ''}` : 'No debt 🎉',
      color: totalDebt > 0 ? 'text-negative' : 'text-positive',
      emoji: totalDebt > 0 ? '⛓️' : '✅',
    },
    {
      id: 'hl-committed',
      label: 'Monthly committed',
      value: `R${totalCommitted.toLocaleString('en-ZA')}`,
      sub: `${playerState.recurringCommitments.filter(c => c.active).length} recurring commitments`,
      color: totalCommitted / playerState.netIncome > 0.7 ? 'text-negative' : totalCommitted / playerState.netIncome > 0.5 ? 'text-warning' : 'text-foreground',
      emoji: '📋',
    },
    {
      id: 'hl-decisions',
      label: 'Decisions made',
      value: `${playerState.decisionsCompleted.length}`,
      sub: `${playerState.eventsExperienced.length} events experienced`,
      color: 'text-accent',
      emoji: '🎯',
    },
    {
      id: 'hl-moments',
      label: 'Money Moments',
      value: `${playerState.moneyMomentsSeen.length}`,
      sub: 'Financial insights earned',
      color: 'text-primary',
      emoji: '💡',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
      {highlights.map(h => (
        <div key={h.id} className="card-surface rounded-2xl p-4 text-center">
          <div className="text-2xl mb-2">{h.emoji}</div>
          <div className="text-xs text-muted-foreground mb-1">{h.label}</div>
          <div className={`font-mono text-lg font-700 ${h.color}`}>{h.value}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{h.sub}</div>
        </div>
      ))}
    </div>
  );
}