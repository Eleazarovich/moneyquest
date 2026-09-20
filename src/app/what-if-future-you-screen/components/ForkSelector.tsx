'use client';
import React from 'react';
import type { WhatIfFork } from '@/services/types';

interface ForkSelectorProps {
  forks: WhatIfFork[];
  selectedForkId: string | null;
  onSelect: (fork: WhatIfFork) => void;
  simulating: boolean;
}

const FORK_EMOJIS: Record<string, string> = {
  'fork-apartment': '🏠',
  'fork-phone': '📱',
  'fork-savings': '🛡️',
};

export default function ForkSelector({ forks, selectedForkId, onSelect, simulating }: ForkSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {forks.map(fork => (
        <button
          key={`fork-${fork.id}`}
          onClick={() => !simulating && onSelect(fork)}
          disabled={simulating}
          className={`decision-card-hover text-left card-surface rounded-2xl p-5 border transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed ${
            selectedForkId === fork.id
              ? 'border-accent/50 bg-accent/5' :'border-border hover:border-accent/30'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="text-3xl flex-shrink-0">{FORK_EMOJIS[fork.id] ?? '🔀'}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-600 text-muted-foreground uppercase tracking-wide">
                  Month {fork.forkMonth}
                </span>
                {selectedForkId === fork.id && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-accent/15 text-accent font-600">Selected</span>
                )}
              </div>
              <h3 className="text-sm font-700 text-foreground mb-2 leading-tight">{fork.title}</h3>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">
                  <span className="text-negative">Your choice: </span>{fork.originalChoice}
                </div>
                <div className="text-xs text-muted-foreground">
                  <span className="text-positive">Alternative: </span>{fork.alternativeChoice}
                </div>
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}