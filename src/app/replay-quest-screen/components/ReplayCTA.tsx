'use client';
import React from 'react';

interface ReplayCTAProps {
  onReplay: () => void;
  replaying: boolean;
  seed: number;
}

export default function ReplayCTA({ onReplay, replaying, seed }: ReplayCTAProps) {
  return (
    <div className="card-surface rounded-2xl p-8 text-center border-2 border-primary/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-radial-gold opacity-20" />
      <div className="relative z-10">
        <div className="text-5xl mb-4 animate-float">🔄</div>
        <h2 className="text-2xl sm:text-3xl font-800 text-foreground mb-3">
          Think you can build a different year?
        </h2>
        <p className="text-muted-foreground mb-2 max-w-lg mx-auto">Same city. Same salary. Same age. Different decisions.
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          Johannesburg · Age 24 · R25,000/month · Seed #{seed}
        </p>

        <button
          onClick={onReplay}
          disabled={replaying}
          className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-primary-foreground rounded-2xl text-lg font-700 hover:bg-primary/90 active:scale-95 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed shadow-2xl shadow-primary/30"
        >
          {replaying ? (
            <>
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Starting new quest…
            </>
          ) : (
            <>
              <span>Replay Quest</span>
              <span className="text-xl">→</span>
            </>
          )}
        </button>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-6 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="text-positive">✓</span>
            Same starting conditions
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-positive">✓</span>
            New event seed
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-positive">✓</span>
            Your choices change everything
          </span>
        </div>
      </div>
    </div>
  );
}