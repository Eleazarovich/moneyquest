'use client';
import React, { useState } from 'react';
import type { Decision, DecisionOption } from '@/services/types';

interface DecisionCardsProps {
  decision: Decision;
  onDecide: (decisionId: string, optionId: string) => void;
  isProcessing: boolean;
  availableCash: number;
}

export default function DecisionCards({ decision, onDecide, isProcessing, availableCash }: DecisionCardsProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<string | null>(null);

  function handleSelect(optionId: string) {
    setSelected(optionId);
    setConfirming(optionId);
  }

  function handleConfirm() {
    if (!confirming) return;
    onDecide(decision.id, confirming);
  }

  function handleCancel() {
    setSelected(null);
    setConfirming(null);
  }

  return (
    <div className="animate-slide-up">
      <div className="card-surface rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-primary/5">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-600 text-primary uppercase tracking-wider">Decision</span>
            <span className="text-xs text-muted-foreground">· {decision.category}</span>
          </div>
          <h2 className="text-xl font-700 text-foreground">{decision.title}</h2>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{decision.narrative}</p>
        </div>

        <div className="p-4 space-y-3">
          {decision.options.map(option => (
            <OptionCard
              key={`opt-${option.id}`}
              option={option}
              isSelected={selected === option.id}
              isConfirming={confirming === option.id}
              availableCash={availableCash}
              onSelect={handleSelect}
            />
          ))}
        </div>

        {confirming && (
          <div className="px-6 py-4 border-t border-border bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="text-sm font-600 text-foreground">
                  Confirm: {decision.options.find(o => o.id === confirming)?.label}
                </div>
                <div className="text-xs text-muted-foreground">This decision cannot be undone.</div>
              </div>
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-500 text-muted-foreground hover:text-foreground card-surface rounded-lg transition-all"
              >
                Back
              </button>
              <button
                onClick={handleConfirm}
                disabled={isProcessing}
                className="px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-700 hover:bg-primary/90 active:scale-95 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isProcessing && <div className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />}
                Confirm
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function OptionCard({
  option,
  isSelected,
  isConfirming,
  availableCash,
  onSelect,
}: {
  option: DecisionOption;
  isSelected: boolean;
  isConfirming: boolean;
  availableCash: number;
  onSelect: (id: string) => void;
}) {
  const canAfford = !option.cost || availableCash >= option.cost;

  return (
    <button
      onClick={() => onSelect(option.id)}
      className={`w-full text-left decision-card-hover card-surface-elevated rounded-xl p-4 border transition-all duration-200 ${
        isSelected
          ? 'border-primary/50 bg-primary/5' :'border-border hover:border-primary/30'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl flex-shrink-0 mt-0.5">{option.emoji}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-sm font-700 text-foreground">{option.label}</span>
            {option.tag && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-500">
                {option.tag}
              </span>
            )}
            {!canAfford && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-negative/10 text-negative font-500">
                Low cash
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed mb-2">{option.description}</p>

          <div className="flex flex-wrap gap-3 text-xs">
            {option.cost > 0 && (
              <span className={`font-mono font-600 ${canAfford ? 'text-foreground' : 'text-negative'}`}>
                Pay now: R{option.cost.toLocaleString('en-ZA', { minimumFractionDigits: 0 })}
              </span>
            )}
            {option.monthlyCommitment && option.monthlyCommitment > 0 && (
              <span className="font-mono font-600 text-warning">
                +R{option.monthlyCommitment.toLocaleString('en-ZA', { minimumFractionDigits: 0 })}/month
              </span>
            )}
            {option.lifestyle && (
              <span className="text-muted-foreground italic">{option.lifestyle}</span>
            )}
          </div>

          {option.debtOffer && (
            <div className="mt-2 px-2 py-1 rounded bg-warning/5 border border-warning/20 text-xs text-warning">
              Credit: {option.debtOffer.provider} · R{option.debtOffer.monthlyRepayment}/month × {option.debtOffer.term} months
            </div>
          )}
        </div>

        <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 transition-all ${isSelected ? 'border-primary bg-primary' : 'border-border'}`}>
          {isSelected && <div className="w-full h-full flex items-center justify-center text-primary-foreground text-xs">✓</div>}
        </div>
      </div>
    </button>
  );
}