import React from 'react';

interface KeyDecision {
  month: number;
  title: string;
  choice: string;
  impact: string;
}

interface KeyDecisionsTimelineProps {
  decisions: KeyDecision[];
}

export default function KeyDecisionsTimeline({ decisions }: KeyDecisionsTimelineProps) {
  return (
    <div className="card-surface rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <div className="text-xs font-600 text-accent uppercase tracking-wide mb-1">Decisions That Mattered</div>
        <h3 className="text-base font-700 text-foreground">Your defining moments</h3>
      </div>

      <div className="p-5 space-y-5">
        {decisions.map((d, idx) => (
          <div key={`decision-${d.month}-${idx}`} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-xs font-700 text-primary flex-shrink-0">
                {d.month}
              </div>
              {idx < decisions.length - 1 && (
                <div className="w-px flex-1 bg-border mt-2" />
              )}
            </div>
            <div className="flex-1 pb-4">
              <div className="text-xs text-muted-foreground mb-0.5">Month {d.month}</div>
              <div className="text-sm font-700 text-foreground mb-1">{d.title}</div>
              <div className="text-xs text-primary font-500 mb-1.5">{d.choice}</div>
              <div className="text-xs text-muted-foreground leading-relaxed">{d.impact}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}