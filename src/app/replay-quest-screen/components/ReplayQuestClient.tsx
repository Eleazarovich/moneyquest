'use client';
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { gameService } from '@/services';
import type { PlayerState, FinancialHealthSnapshot } from '@/services/types';
import GameTopbar from '@/components/GameTopbar';
import RunHighlights from './RunHighlights';
import HealthSummaryRow from './HealthSummaryRow';
import ReplayCTA from './ReplayCTA';
import Link from 'next/link';

export default function ReplayQuestClient() {
  const [playerState, setPlayerState] = useState<PlayerState | null>(null);
  const [health, setHealth] = useState<FinancialHealthSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [replaying, setReplaying] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        // BACKEND INTEGRATION POINT: load from active session
        const state = await gameService.createRun(77321);
        for (let m = 1; m <= 12; m++) {
          await gameService.processMonth(state.runId, m);
          if (m === 1) await gameService.makeDecision(state.runId, 'decision-housing', 'opt-housing-mid');
          if (m === 2) await gameService.makeDecision(state.runId, 'decision-phone', 'opt-phone-mid');
          if (m === 3) await gameService.makeDecision(state.runId, 'decision-transport', 'opt-transport-public');
          if (m === 4) await gameService.makeDecision(state.runId, 'decision-clothing', 'opt-clothing-basic');
          if (m === 5) await gameService.makeDecision(state.runId, 'decision-savings', 'opt-savings-serious');
        }
        const ps = await gameService.getPlayerState(state.runId);
        const h = await gameService.getFinancialHealth(state.runId);
        setPlayerState(ps);
        setHealth(h);
      } catch (err) {
        toast.error('Failed to load run summary.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleReplay() {
    if (!playerState) return;
    setReplaying(true);
    try {
      const newState = await gameService.replayQuest(playerState.runId);
      toast.success('New quest started! Same city, new choices.', { duration: 2000 });
      setTimeout(() => {
        window.location.href = '/game-simulation-screen';
      }, 1500);
    } catch (err) {
      toast.error('Failed to start replay.');
      setReplaying(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <GameTopbar />
        <div className="pt-24 px-4 max-w-screen-2xl mx-auto animate-pulse space-y-6">
          <div className="h-12 bg-muted rounded-lg w-64" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={`rpskel-${i + 1}`} className="h-40 bg-muted rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!playerState || !health) return null;

  return (
    <div className="min-h-screen bg-background">
      <GameTopbar currentMonth={12} availableCash={playerState.availableCash} showCash />

      <main className="pt-20 pb-16 px-4 max-w-screen-2xl mx-auto">
        {/* Header */}
        <div className="mt-8 mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <span className="text-lg">🏁</span>
            <span className="text-sm font-600 text-primary">Quest Complete — 12 Months</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-800 text-foreground mb-3">
            You made it through{' '}
            <span className="text-gradient-gold">your year.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Same starting point as everyone else. R25,000/month. Johannesburg. Age 24.
            <br />
            <span className="text-foreground/80">What would you do differently?</span>
          </p>
        </div>

        {/* Run highlights */}
        <RunHighlights playerState={playerState} />

        {/* Health summary */}
        {health && (
          <div className="mt-6">
            <HealthSummaryRow health={health} />
          </div>
        )}

        {/* Key decisions */}
        <div className="mt-8 card-surface rounded-2xl p-6">
          <h3 className="text-lg font-700 text-foreground mb-5">Decisions that defined your year</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                id: 'dec-housing',
                month: 1,
                label: 'Housing',
                choice: playerState.housingChoice?.includes('premium')
                  ? 'Sandton Studio' : playerState.housingChoice?.includes('mid')
                  ? 'Braamfontein 1-Bed' :'Roodepoort Flatlet',
                emoji: '🏠',
                impact: playerState.housingChoice?.includes('premium')
                  ? 'R162,000/year' : playerState.housingChoice?.includes('mid')
                  ? 'R114,000/year' :'R78,000/year',
              },
              {
                id: 'dec-phone',
                month: 2,
                label: 'Phone',
                choice: playerState.phoneChoice?.includes('premium')
                  ? 'Galaxy S25 contract' : playerState.phoneChoice?.includes('mid')
                  ? 'Galaxy A55 contract' :'Repaired old phone',
                emoji: '📱',
                impact: playerState.phoneChoice?.includes('premium')
                  ? 'R23,364 total' : playerState.phoneChoice?.includes('mid')
                  ? 'R7,176 total' :'R450 once',
              },
              {
                id: 'dec-transport',
                month: 3,
                label: 'Transport',
                choice: playerState.transportChoice?.includes('car') ? 'Bought the Corolla' : 'Gautrain + Uber',
                emoji: '🚗',
                impact: playerState.transportChoice?.includes('car') ? 'R56,400/year' : 'R21,600/year',
              },
              {
                id: 'dec-savings',
                month: 5,
                label: 'Savings habit',
                choice: playerState.monthsWithSavings >= 6
                  ? 'Saved consistently'
                  : playerState.monthsWithSavings > 0
                  ? 'Saved sometimes' :'Skipped saving',
                emoji: '🛡️',
                impact: `R${playerState.totalSavings.toLocaleString('en-ZA')} built`,
              },
            ].map(d => (
              <div key={d.id} className="card-surface-elevated rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{d.emoji}</span>
                  <div>
                    <div className="text-xs text-muted-foreground">Month {d.month}</div>
                    <div className="text-sm font-700 text-foreground">{d.label}</div>
                  </div>
                </div>
                <div className="text-xs font-500 text-primary mb-1">{d.choice}</div>
                <div className="text-xs text-muted-foreground">{d.impact}</div>
              </div>
            ))}
          </div>
        </div>

        {/* North Star message */}
        <div className="mt-8 card-surface rounded-2xl p-8 text-center bg-radial-gold relative overflow-hidden">
          <div className="absolute inset-0 bg-radial-gold opacity-40" />
          <div className="relative z-10">
            <div className="text-3xl mb-4">💡</div>
            <blockquote className="text-xl sm:text-2xl font-700 text-foreground mb-4 max-w-2xl mx-auto leading-relaxed">
              "Every lifestyle has a cost. Every commitment affects future choices. And the more financially resilient you become, the more choices you keep."
            </blockquote>
            <p className="text-sm text-muted-foreground">— MoneyQuest</p>
          </div>
        </div>

        {/* Navigation row */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/what-if-future-you-screen"
            className="px-6 py-3 card-surface text-foreground rounded-xl font-600 text-sm hover:bg-muted transition-all"
          >
            What if I chose differently?
          </Link>
          <Link
            href="/year-in-money-screen"
            className="px-6 py-3 card-surface text-foreground rounded-xl font-600 text-sm hover:bg-muted transition-all"
          >
            Year in Money
          </Link>
          <Link
            href="/financial-health-screen"
            className="px-6 py-3 card-surface text-muted-foreground rounded-xl font-600 text-sm hover:text-foreground hover:bg-muted transition-all"
          >
            Financial Health
          </Link>
        </div>

        {/* Replay CTA */}
        <div className="mt-8">
          <ReplayCTA onReplay={handleReplay} replaying={replaying} seed={playerState.seed} />
        </div>
      </main>
    </div>
  );
}