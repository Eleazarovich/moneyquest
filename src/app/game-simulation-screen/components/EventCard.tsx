import React from 'react';
import type { LifeEvent } from '@/services/types';

interface EventCardProps {
  event: LifeEvent;
}

const TYPE_COLORS: Record<string, string> = {
  social: 'text-accent border-accent/20 bg-accent/5',
  family: 'text-warning border-warning/20 bg-warning/5',
  career: 'text-positive border-positive/20 bg-positive/5',
  unexpected: 'text-negative border-negative/20 bg-negative/5',
  relationship: 'text-primary border-primary/20 bg-primary/5',
  income_shock: 'text-negative border-negative/30 bg-negative/10',
};

const TYPE_LABELS: Record<string, string> = {
  social: 'Social',
  family: 'Family',
  career: 'Career',
  unexpected: 'Unexpected',
  relationship: 'Life',
  income_shock: 'Work',
};

export default function EventCard({ event }: EventCardProps) {
  const colorClass = TYPE_COLORS[event.type] ?? 'text-muted-foreground border-border bg-muted/5';
  const label = TYPE_LABELS[event.type] ?? event.type;

  return (
    <div className={`card-surface rounded-xl p-5 border animate-slide-up`}>
      <div className="flex items-start gap-4">
        <div className="text-3xl flex-shrink-0 mt-0.5">{event.emoji}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs font-600 px-2 py-0.5 rounded-full border ${colorClass}`}>
              {label}
            </span>
            {event.cashEffect && (
              <span className={`font-mono text-xs font-600 ${event.cashEffect > 0 ? 'text-positive' : 'text-negative'}`}>
                {event.cashEffect > 0 ? '+' : ''}R{Math.abs(event.cashEffect).toLocaleString('en-ZA', { minimumFractionDigits: 0 })}
              </span>
            )}
          </div>
          <h3 className="text-base font-700 text-foreground mb-1.5">{event.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{event.narrative}</p>
        </div>
      </div>
    </div>
  );
}