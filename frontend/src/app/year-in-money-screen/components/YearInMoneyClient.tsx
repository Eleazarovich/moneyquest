'use client';
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { gameService } from '@/services';
import type { YearInMoneySummary, PlayerState } from '@/services/types';
import GameTopbar from '@/components/GameTopbar';
import YearSummaryHero from './YearSummaryHero';
import AnnualisationReveal from './AnnualisationReveal';
import KeyDecisionsTimeline from './KeyDecisionsTimeline';
import SpendingBreakdownChart from './SpendingBreakdownChart';
import MonthlyFlowChart from './MonthlyFlowChart';
import Link from 'next/link';

export default function YearInMoneyClient() {
  const [summary, setSummary] = useState<YearInMoneySummary | null>(null);
  const [playerState, setPlayerState] = useState<PlayerState | null>(null);
  const [loading, setLoading] = useState(true);
  const [revealStep, setRevealStep] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const state = (await gameService.getActiveRun()) ?? (await gameService.createRun());
        const yr = await gameService.getYearInMoney(state.runId);
        const ps = await gameService.getPlayerState(state.runId);
        setSummary(yr);
        setPlayerState(ps);
        // Staggered reveal
        setTimeout(() => setRevealStep(1), 400);
        setTimeout(() => setRevealStep(2), 900);
        setTimeout(() => setRevealStep(3), 1400);
        setTimeout(() => setRevealStep(4), 1900);
      } catch (err) {
        toast.error('Failed to load Year in Money summary.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <GameTopbar />
        <div className="pt-24 px-4 max-w-screen-2xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-muted rounded-lg w-80" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={`yskel-${i + 1}`} className="h-28 bg-muted rounded-2xl" />
              ))}
            </div>
            <div className="h-64 bg-muted rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!summary || !playerState) return null;

  return (
    <div className="min-h-screen bg-background">
      <GameTopbar currentMonth={playerState.currentMonth} availableCash={playerState.availableCash} showCash />

      <main className="pt-20 pb-16 px-4 max-w-screen-2xl mx-auto">
        {/* Header */}
        <div className="mt-8 mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <span className="text-lg">📅</span>
            <span className="text-sm font-600 text-primary">October 2026 — September 2027</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-800 text-foreground mb-3">
            Your Year in{' '}
            <span className="text-gradient-gold">Money</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            12 months. R{summary.totalGrossIncome.toLocaleString('en-ZA')} earned. Here's where it all went.
          </p>
        </div>

        {/* Hero metrics */}
        <div className={`transition-all duration-700 ${revealStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <YearSummaryHero summary={summary} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
          {/* Left: charts */}
          <div className="xl:col-span-2 space-y-6">
            <div className={`transition-all duration-700 delay-100 ${revealStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              <SpendingBreakdownChart spendByCategory={summary.spendByCategory} totalSpent={summary.totalSpent} />
            </div>
            <div className={`transition-all duration-700 delay-200 ${revealStep >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              <MonthlyFlowChart monthlyBreakdown={summary.monthlyBreakdown} />
            </div>
          </div>

          {/* Right: reveals + decisions */}
          <div className="xl:col-span-1 space-y-6">
            <div className={`transition-all duration-700 delay-150 ${revealStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              <AnnualisationReveal surprises={summary.annualisedSurprises} />
            </div>
            <div className={`transition-all duration-700 delay-300 ${revealStep >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              <KeyDecisionsTimeline decisions={summary.keyDecisions} />
            </div>
          </div>
        </div>

        {/* CTA row */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/what-if-future-you-screen"
            className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-700 text-base hover:bg-primary/90 active:scale-95 transition-all duration-150 shadow-lg shadow-primary/20 text-center"
          >
            What if I chose differently? →
          </Link>
          <Link
            href="/replay-quest-screen"
            className="px-8 py-4 card-surface text-foreground rounded-xl font-600 text-base hover:bg-muted transition-all text-center"
          >
            Replay Quest
          </Link>
          <Link
            href="/financial-health-screen"
            className="px-8 py-4 card-surface text-muted-foreground rounded-xl font-600 text-base hover:text-foreground hover:bg-muted transition-all text-center"
          >
            Financial Health
          </Link>
        </div>
      </main>
    </div>
  );
}
