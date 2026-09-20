'use client';
import React, { useState } from 'react';
import type { HealthState } from '@/services/types';

interface HealthDimensionCardProps {
  label: string;
  icon: string;
  state: HealthState;
  value: number;
  explanation: string;
  description: string;
  dimensionKey: string;
}

const STATE_FILL: Record<HealthState, number> = {
  Strong: 100,
  Healthy: 83,
  Stable: 66,
  Building: 50,
  Vulnerable: 33,
  Critical: 16,
};

const STATE_BAR_COLOR: Record<HealthState, string> = {
  Strong: 'var(--positive)',
  Healthy: '#86EFAC',
  Stable: '#60A5FA',
  Building: 'var(--warning)',
  Vulnerable: '#FB923C',
  Critical: 'var(--negative)',
};

export default function HealthDimensionCard({
  label,
  icon,
  state,
  value,
  explanation,
  description,
  dimensionKey,
}: HealthDimensionCardProps) {
  const [expanded, setExpanded] = useState(false);
  const fillPct = STATE_FILL[state];
  const barColor = STATE_BAR_COLOR[state];
  const stateClass = `status-${state.toLowerCase()}`;
  const bgClass = `bg-status-${state.toLowerCase()}`;

  return (
    <div
      className={`card-surface rounded-2xl p-5 border cursor-pointer transition-all duration-200 hover:border-primary/20 ${bgClass}`}
      onClick={() => setExpanded(e => !e)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <div>
            <div className="text-xs text-muted-foreground">{description}</div>
            <div className="text-sm font-700 text-foreground">{label}</div>
          </div>
        </div>
        <div className={`text-xs font-700 px-2 py-1 rounded-full border ${bgClass} ${stateClass}`}>
          {state}
        </div>
      </div>

      <div className="health-bar-track h-1.5 mb-3">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${fillPct}%`, background: barColor }}
        />
      </div>

      <div className={`overflow-hidden transition-all duration-300 ${expanded ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className="text-xs text-muted-foreground leading-relaxed pt-2 border-t border-border/50">
          {explanation}
        </p>
      </div>

      {!expanded && (
        <p className="text-xs text-muted-foreground/60 mt-1">Tap for details</p>
      )}
    </div>
  );
}