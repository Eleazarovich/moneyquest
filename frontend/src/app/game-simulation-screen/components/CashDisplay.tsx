'use client';
import React, { useState, useEffect } from 'react';

interface CashDisplayProps {
  availableCash: number;
  netIncome: number;
  totalCommitted: number;
  totalDebt: number;
}

export default function CashDisplay({ availableCash, netIncome, totalCommitted, totalDebt }: CashDisplayProps) {
  const [displayed, setDisplayed] = useState(availableCash);

  useEffect(() => {
    setDisplayed(availableCash);
  }, [availableCash]);

  const isLow = availableCash < 1000;
  const isWarning = availableCash < 3000 && !isLow;

  return (
    <div className={`card-surface rounded-2xl p-6 ${isLow ? 'border-negative/30 animate-debt-flash' : isWarning ? 'border-warning/30' : 'border-border'}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-xs font-600 text-muted-foreground uppercase tracking-wider mb-1">
            Available right now
          </div>
          <div className={`cash-display text-4xl font-700 ${isLow ? 'text-negative' : isWarning ? 'text-warning' : 'text-foreground'}`}>
            R{displayed.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
          </div>
          {isLow && (
            <div className="flex items-center gap-1.5 mt-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-negative animate-pulse" />
              <span className="text-xs text-negative font-500">Very low — watch your spending</span>
            </div>
          )}
        </div>

        <div className="flex gap-4 sm:gap-6">
          <div className="text-right">
            <div className="text-xs text-muted-foreground mb-0.5">Salary received</div>
            <div className="font-mono text-sm font-600 text-positive">+R{netIncome.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</div>
          </div>
          {totalCommitted > 0 && (
            <div className="text-right">
              <div className="text-xs text-muted-foreground mb-0.5">Committed</div>
              <div className="font-mono text-sm font-600 text-warning">−R{totalCommitted.toLocaleString('en-ZA', { minimumFractionDigits: 0 })}</div>
            </div>
          )}
          {totalDebt > 0 && (
            <div className="text-right">
              <div className="text-xs text-muted-foreground mb-0.5">Debt repayments</div>
              <div className="font-mono text-sm font-600 text-negative">−R{totalDebt.toLocaleString('en-ZA', { minimumFractionDigits: 0 })}</div>
            </div>
          )}
        </div>
      </div>

      {(totalCommitted > 0 || totalDebt > 0) && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>Income allocation</span>
            <span>R{netIncome.toLocaleString('en-ZA', { minimumFractionDigits: 0 })}</span>
          </div>
          <div className="health-bar-track h-2 flex overflow-hidden rounded-full">
            <div
              className="bg-negative h-full transition-all duration-700"
              style={{ width: `${Math.min(100, (totalDebt / netIncome) * 100)}%` }}
            />
            <div
              className="bg-warning h-full transition-all duration-700"
              style={{ width: `${Math.min(100, (totalCommitted / netIncome) * 100)}%` }}
            />
            <div
              className="bg-positive h-full transition-all duration-700"
              style={{ width: `${Math.max(0, Math.min(100, (availableCash / netIncome) * 100))}%` }}
            />
          </div>
          <div className="flex gap-4 mt-2 text-xs">
            {totalDebt > 0 && <span className="flex items-center gap-1 text-negative"><span className="w-2 h-2 rounded-full bg-negative inline-block" />Debt</span>}
            {totalCommitted > 0 && <span className="flex items-center gap-1 text-warning"><span className="w-2 h-2 rounded-full bg-warning inline-block" />Committed</span>}
            <span className="flex items-center gap-1 text-positive"><span className="w-2 h-2 rounded-full bg-positive inline-block" />Available</span>
          </div>
        </div>
      )}
    </div>
  );
}