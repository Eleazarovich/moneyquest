'use client';
import React, { useState } from 'react';

interface Surprise {
  label: string;
  monthly: number;
  annual: number;
  description: string;
}

interface AnnualisationRevealProps {
  surprises: Surprise[];
}

export default function AnnualisationReveal({ surprises }: AnnualisationRevealProps) {
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  function toggleReveal(label: string) {
    setRevealed(prev => ({ ...prev, [label]: !prev[label] }));
  }

  return (
    <div className="card-surface rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <div className="text-xs font-600 text-primary uppercase tracking-wide mb-1">Annualisation Reveals</div>
        <h3 className="text-base font-700 text-foreground">The numbers behind the numbers</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Monthly costs hide the annual reality. Tap to reveal.</p>
      </div>

      <div className="divide-y divide-border">
        {surprises.map(s => (
          <button
            key={`reveal-${s.label}`}
            onClick={() => toggleReveal(s.label)}
            className="w-full px-5 py-4 text-left hover:bg-muted/30 transition-all"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-600 text-foreground">{s.label}</span>
              <span className="text-xs text-muted-foreground">
                {revealed[s.label] ? '▲ hide' : '▼ reveal'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-muted-foreground">
                R{s.monthly.toLocaleString('en-ZA')}/mo
              </span>
              <span className="text-muted-foreground/40">→</span>
              <span className={`font-mono text-sm font-700 transition-all duration-500 ${revealed[s.label] ? 'text-warning opacity-100' : 'opacity-0 blur-sm'}`}>
                R{s.annual.toLocaleString('en-ZA')}/year
              </span>
            </div>
            {revealed[s.label] && (
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed animate-fade-in">
                {s.description}
              </p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}