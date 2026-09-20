'use client';
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { gameService } from '@/services';
import type { WhatIfFork, PlayerState } from '@/services/types';
import GameTopbar from '@/components/GameTopbar';
import ForkSelector from './ForkSelector';
import ComparisonPanel from './ComparisonPanel';
import Link from 'next/link';

export default function WhatIfClient() {
  const [forks, setForks] = useState<WhatIfFork[]>([]);
  const [selectedFork, setSelectedFork] = useState<WhatIfFork | null>(null);
  const [playerState, setPlayerState] = useState<PlayerState | null>(null);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [runId, setRunId] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const state = (await gameService.getActiveRun()) ?? (await gameService.createRun());
        const ps = await gameService.getPlayerState(state.runId);
        const availableForks = await gameService.getWhatIfForks(state.runId);
        setPlayerState(ps);
        setForks(availableForks);
        setRunId(state.runId);
      } catch (err) {
        toast.error('Failed to load What-If scenarios.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSelectFork(fork: WhatIfFork) {
    setSimulating(true);
    try {
      const result = await gameService.simulateWhatIf(runId, fork.id);
      setSelectedFork(result);
    } catch (err) {
      toast.error('Failed to simulate alternative path.');
    } finally {
      setSimulating(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <GameTopbar />
        <div className="pt-24 px-4 max-w-screen-2xl mx-auto animate-pulse space-y-6">
          <div className="h-10 bg-muted rounded-lg w-72" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={`wifskel-${i + 1}`} className="h-32 bg-muted rounded-2xl" />
            ))}
          </div>
          <div className="h-80 bg-muted rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <GameTopbar currentMonth={playerState?.currentMonth} availableCash={playerState?.availableCash} showCash />

      <main className="pt-20 pb-16 px-4 max-w-screen-2xl mx-auto">
        <div className="mt-8 mb-10">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-3">
                <span className="text-xs font-600 text-accent uppercase tracking-wide">What-If / Future You</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-800 text-foreground mb-2">
                What if you chose{' '}
                <span className="text-gradient-purple">differently?</span>
              </h1>
              <p className="text-muted-foreground max-w-xl">
                Select a key decision from your year. See how a different choice would have changed your financial outcome — month by month.
              </p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <Link
                href="/year-in-money-screen"
                className="px-4 py-2 card-surface text-sm font-600 text-muted-foreground hover:text-foreground rounded-lg transition-all"
              >
                ← Year in Money
              </Link>
              <Link
                href="/replay-quest-screen"
                className="px-4 py-2 bg-primary/10 text-primary text-sm font-600 rounded-lg hover:bg-primary/20 transition-all"
              >
                Replay Quest →
              </Link>
            </div>
          </div>
        </div>

        {/* Fork selector */}
        <ForkSelector
          forks={forks}
          selectedForkId={selectedFork?.id ?? null}
          onSelect={handleSelectFork}
          simulating={simulating}
        />

        {/* Comparison panel */}
        {selectedFork && (
          <div className="mt-8 animate-slide-up">
            <ComparisonPanel fork={selectedFork} />
          </div>
        )}

        {!selectedFork && !simulating && (
          <div className="mt-12 text-center py-16 card-surface rounded-2xl border-dashed border-2 border-border">
            <div className="text-4xl mb-4">🔀</div>
            <h3 className="text-lg font-700 text-foreground mb-2">Choose a fork above</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Select one of the three key decisions from your year to see how a different choice would have played out.
            </p>
          </div>
        )}

        {simulating && (
          <div className="mt-12 text-center py-16">
            <div className="text-4xl mb-4 animate-float">⏳</div>
            <div className="text-lg font-600 text-foreground mb-1">Simulating alternative path…</div>
            <div className="text-sm text-muted-foreground">Recalculating 12 months from the decision point</div>
          </div>
        )}
      </main>
    </div>
  );
}
