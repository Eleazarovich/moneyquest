'use client';
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { gameService } from '@/services';
import type { FinancialHealthSnapshot, PlayerState } from '@/services/types';
import GameTopbar from '@/components/GameTopbar';
import FinancialShield from '@/components/FinancialShield';
import HealthDimensionCard from './HealthDimensionCard';
import HealthRadarChart from './HealthRadarChart';
import Link from 'next/link';

export default function FinancialHealthClient() {
  const [health, setHealth] = useState<FinancialHealthSnapshot | null>(null);
  const [playerState, setPlayerState] = useState<PlayerState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // BACKEND INTEGRATION POINT: fetch active runId from session/localStorage
        const state = await gameService.createRun(12345);
        // Simulate some play for demo state
        await gameService.processMonth(state.runId, 1);
        await gameService.makeDecision(state.runId, 'decision-housing', 'opt-housing-mid');
        await gameService.processMonth(state.runId, 2);
        await gameService.makeDecision(state.runId, 'decision-phone', 'opt-phone-premium');
        await gameService.processMonth(state.runId, 3);
        await gameService.processMonth(state.runId, 4);
        await gameService.processMonth(state.runId, 5);
        await gameService.makeDecision(state.runId, 'decision-savings', 'opt-savings-small');

        const snap = await gameService.getFinancialHealth(state.runId);
        const ps = await gameService.getPlayerState(state.runId);
        setHealth(snap);
        setPlayerState(ps);
      } catch (err) {
        toast.error('Failed to load financial health data.');
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
            <div className="h-8 bg-muted rounded-lg w-64" />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 5 }, (_, i) => (
                <div key={`skel-${i + 1}`} className="h-40 bg-muted rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!health || !playerState) return null;

  const emergencyBucket = playerState.savingsBuckets.find(b => b.isEmergencyFund);
  const emergencyBalance = emergencyBucket?.balance ?? 0;
  const monthlyExpenses = 8000;
  const emergencyMonths = emergencyBalance / monthlyExpenses;

  const dimensions = [
    { key: 'resilience', label: 'Resilience', data: health.resilience, icon: '🛡️', description: 'Ability to absorb unexpected financial shocks' },
    { key: 'liquidity', label: 'Liquidity', data: health.liquidity, icon: '💧', description: 'Accessible cash available right now' },
    { key: 'debtLoad', label: 'Debt Load', data: health.debtLoad, icon: '⛓️', description: 'Future income committed to debt repayments' },
    { key: 'savingHabit', label: 'Saving Habit', data: health.savingHabit, icon: '🌱', description: 'Consistency of saving across months played' },
    { key: 'lifestyleBalance', label: 'Lifestyle Balance', data: health.lifestyleBalance, icon: '⚖️', description: 'Fixed commitments relative to take-home income' },
  ] as const;

  return (
    <div className="min-h-screen bg-background">
      <GameTopbar
        currentMonth={playerState.currentMonth}
        availableCash={playerState.availableCash}
        showCash
      />

      <main className="pt-20 pb-16 px-4 max-w-screen-2xl mx-auto">
        <div className="mt-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-3">
                <span className="text-xs font-600 text-accent uppercase tracking-wide">Financial Health</span>
              </div>
              <h1 className="text-3xl font-800 text-foreground">Your Financial Picture</h1>
              <p className="text-muted-foreground mt-1">
                Month {playerState.currentMonth} · Five dimensions · No single score
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/game-simulation-screen"
                className="px-4 py-2 card-surface text-sm font-600 text-muted-foreground hover:text-foreground rounded-lg transition-all"
              >
                ← Back to Game
              </Link>
              <Link
                href="/year-in-money-screen"
                className="px-4 py-2 bg-primary/10 text-primary text-sm font-600 rounded-lg hover:bg-primary/20 transition-all"
              >
                Year in Money →
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Left: Shield + radar */}
          <div className="xl:col-span-1 space-y-6">
            <div className="card-surface rounded-2xl p-6 flex flex-col items-center">
              <div className="text-sm font-600 text-muted-foreground mb-4 text-center">Financial Shield</div>
              <FinancialShield
                emergencyMonths={emergencyMonths}
                emergencyBalance={emergencyBalance}
                size="lg"
              />
              <div className="mt-4 w-full">
                <div className="text-xs text-muted-foreground text-center mb-2">Emergency coverage</div>
                <div className="health-bar-track h-2">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${Math.min(100, (emergencyMonths / 3) * 100)}%`,
                      background: emergencyMonths >= 2 ? 'var(--positive)' : emergencyMonths >= 1 ? 'var(--warning)' : 'var(--negative)',
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0</span>
                  <span>3 months target</span>
                </div>
              </div>
            </div>

            <HealthRadarChart health={health} />
          </div>

          {/* Right: dimension cards */}
          <div className="xl:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {dimensions.map(dim => (
                <HealthDimensionCard
                  key={`dim-${dim.key}`}
                  label={dim.label}
                  icon={dim.icon}
                  state={dim.data.state}
                  value={dim.data.value}
                  explanation={dim.data.explanation}
                  description={dim.description}
                  dimensionKey={dim.key}
                />
              ))}
            </div>

            {/* Journey stage */}
            <div className="mt-6 card-surface rounded-2xl p-6">
              <h3 className="text-base font-700 text-foreground mb-4">Your Financial Journey Stage</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {[
                  { id: 'stage-stabilise', label: 'Stabilise', desc: 'Survive the month', active: true },
                  { id: 'stage-control', label: 'Control', desc: 'Understand your money', active: playerState.currentMonth >= 3 },
                  { id: 'stage-protect', label: 'Protect', desc: 'Build resilience', active: emergencyBalance > 0 },
                  { id: 'stage-balance', label: 'Balance', desc: 'Enjoy sustainably', active: false },
                  { id: 'stage-build', label: 'Build', desc: 'Save consistently', active: playerState.monthsWithSavings >= 3 },
                  { id: 'stage-grow', label: 'Grow', desc: 'Long-term wealth', active: false },
                ].map((stage, idx) => (
                  <div
                    key={stage.id}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      stage.active
                        ? 'bg-primary/10 border-primary/30' :'border-border opacity-40'
                    }`}
                  >
                    <div className="text-xs font-700 text-foreground mb-0.5">{stage.label}</div>
                    <div className="text-xs text-muted-foreground">{stage.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}