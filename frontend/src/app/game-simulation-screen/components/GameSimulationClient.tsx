'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { gameService } from '@/services';
import type { PlayerState, LifeEvent, Decision, MoneyMoment, TaxConfiguration } from '@/services/types';
import GameTopbar from '@/components/GameTopbar';
import MoneyMomentModal from '@/components/MoneyMomentModal';
import PayslipReveal from './PayslipReveal';
import MonthHeader from './MonthHeader';
import EventCard from './EventCard';
import DecisionCards from './DecisionCards';
import TransactionFeed from './TransactionFeed';
import CashDisplay from './CashDisplay';
import MonthNavigator from './MonthNavigator';

type GamePhaseLocal = 'loading' | 'payslip' | 'playing' | 'month_end' | 'game_over';

export default function GameSimulationClient() {
  const [playerState, setPlayerState] = useState<PlayerState | null>(null);
  const [currentEvents, setCurrentEvents] = useState<LifeEvent[]>([]);
  const [currentDecisions, setCurrentDecisions] = useState<Decision[]>([]);
  const [activeDecision, setActiveDecision] = useState<Decision | null>(null);
  const [moneyMoment, setMoneyMoment] = useState<MoneyMoment | null>(null);
  const [taxConfiguration, setTaxConfiguration] = useState<TaxConfiguration | null>(null);
  const [localPhase, setLocalPhase] = useState<GamePhaseLocal>('loading');
  const [isProcessing, setIsProcessing] = useState(false);
  const [monthProcessed, setMonthProcessed] = useState(false);

  // Initialize run
  useEffect(() => {
    async function init() {
      try {
        const state = (await gameService.getActiveRun()) ?? (await gameService.createRun());
        const tax = await gameService.getTaxConfiguration();
        setPlayerState(state);
        setTaxConfiguration(tax);
        setMonthProcessed(state.currentMonth > 0);
        setLocalPhase(state.currentMonth === 0 ? 'payslip' : 'playing');
      } catch (err) {
        toast.error('Failed to start quest. Please refresh.');
      }
    }
    init();
  }, []);

  const processCurrentMonth = useCallback(async (state: PlayerState, month: number) => {
    if (isProcessing || monthProcessed) return;
    setIsProcessing(true);
    try {
      const result = await gameService.processMonth(state.runId, month);
      const updated = await gameService.getPlayerState(state.runId);
      setPlayerState(updated);
      setCurrentEvents(result.events);
      setCurrentDecisions(result.decisions);
      if (result.decisions.length > 0) {
        setActiveDecision(result.decisions[0]);
      }
      setMonthProcessed(true);
    } catch (err) {
      toast.error('Error processing month. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, monthProcessed]);

  function handlePayslipDone() {
    setLocalPhase('playing');
    if (playerState) {
      processCurrentMonth(playerState, 1);
    }
  }

  async function handleDecisionMade(decisionId: string, optionId: string) {
    if (!playerState) return;
    setIsProcessing(true);
    try {
      const result = await gameService.makeDecision(playerState.runId, decisionId, optionId);
      setPlayerState(result.newState);
      setActiveDecision(null);
      // Check for more decisions
      const remaining = currentDecisions.filter(d => d.id !== decisionId && !result.newState.decisionsCompleted.includes(d.id));
      if (remaining.length > 0) {
        setActiveDecision(remaining[0]);
      }
      if (result.moneyMoment) {
        setMoneyMoment(result.moneyMoment);
      }
      toast.success('Decision made', { duration: 1500 });
    } catch (err) {
      toast.error('Could not process decision.');
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleNextMonth() {
    if (!playerState) return;
    const nextMonth = playerState.currentMonth + 1;
    if (nextMonth > 12) {
      window.location.href = '/year-in-money-screen';
      return;
    }
    setMonthProcessed(false);
    setCurrentEvents([]);
    setCurrentDecisions([]);
    setActiveDecision(null);
    setIsProcessing(true);
    try {
      const result = await gameService.processMonth(playerState.runId, nextMonth);
      const updated = await gameService.getPlayerState(playerState.runId);
      setPlayerState(updated);
      setCurrentEvents(result.events);
      setCurrentDecisions(result.decisions);
      if (result.decisions.length > 0) {
        setActiveDecision(result.decisions[0]);
      }
      setMonthProcessed(true);
    } catch (err) {
      toast.error('Error advancing month.');
    } finally {
      setIsProcessing(false);
    }
  }

  if (localPhase === 'loading' || !playerState) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-float">💼</div>
          <div className="text-lg font-600 text-foreground mb-2">Preparing your quest…</div>
          <div className="text-sm text-muted-foreground">Setting up Johannesburg, 2026</div>
        </div>
      </div>
    );
  }

  if (localPhase === 'payslip' && taxConfiguration) {
    return (
      <>
        <GameTopbar />
        <PayslipReveal onContinue={handlePayslipDone} taxConfiguration={taxConfiguration} />
      </>
    );
  }

  const totalCommitted = playerState.recurringCommitments
    .filter(c => c.active)
    .reduce((sum, c) => sum + c.amount, 0);
  const totalDebt = playerState.debts
    .filter(d => d.active)
    .reduce((sum, d) => sum + d.monthlyRepayment, 0);

  return (
    <div className="min-h-screen bg-background">
      <GameTopbar
        currentMonth={playerState.currentMonth}
        availableCash={playerState.availableCash}
        showCash
      />

      <main className="pt-20 pb-16 px-4 max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-4">
          {/* Left column — main gameplay */}
          <div className="xl:col-span-2 space-y-6">
            <MonthHeader
              month={playerState.currentMonth}
              isProcessing={isProcessing}
            />

            <CashDisplay
              availableCash={playerState.availableCash}
              netIncome={playerState.netIncome}
              totalCommitted={totalCommitted}
              totalDebt={totalDebt}
            />

            {/* Events */}
            {currentEvents.length > 0 && (
              <div className="space-y-4">
                {currentEvents.map(event => (
                  <EventCard key={`event-${event.id}`} event={event} />
                ))}
              </div>
            )}

            {/* Active decision */}
            {activeDecision && (
              <DecisionCards
                decision={activeDecision}
                onDecide={handleDecisionMade}
                isProcessing={isProcessing}
                availableCash={playerState.availableCash}
              />
            )}

            {/* Month navigation */}
            {!activeDecision && monthProcessed && (
              <MonthNavigator
                currentMonth={playerState.currentMonth}
                onNext={handleNextMonth}
                isProcessing={isProcessing}
              />
            )}
          </div>

          {/* Right column — transaction feed */}
          <div className="xl:col-span-1">
            <TransactionFeed
              transactions={playerState.transactions}
              recurringCommitments={playerState.recurringCommitments.filter(c => c.active)}
              debts={playerState.debts.filter(d => d.active)}
              totalSavings={playerState.totalSavings}
            />
          </div>
        </div>
      </main>

      <MoneyMomentModal moment={moneyMoment} onDismiss={() => setMoneyMoment(null)} />
    </div>
  );
}
