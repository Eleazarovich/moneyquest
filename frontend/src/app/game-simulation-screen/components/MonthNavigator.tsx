import React from 'react';
import Link from 'next/link';

interface MonthNavigatorProps {
  currentMonth: number;
  onNext: () => void;
  isProcessing: boolean;
}

export default function MonthNavigator({ currentMonth, onNext, isProcessing }: MonthNavigatorProps) {
  const isLastMonth = currentMonth >= 12;

  return (
    <div className="card-surface rounded-2xl p-6 text-center animate-slide-up">
      <div className="text-2xl mb-3">{isLastMonth ? '🏁' : '✅'}</div>
      <h3 className="text-lg font-700 text-foreground mb-1">
        {isLastMonth ? 'Month 12 complete' : `Month ${currentMonth} complete`}
      </h3>
      <p className="text-sm text-muted-foreground mb-5">
        {isLastMonth
          ? "That's your year. Time to see where the money went."
          : `${12 - currentMonth} month${12 - currentMonth !== 1 ? 's' : ''} remaining in your quest.`}
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {isLastMonth ? (
          <>
            <Link
              href="/year-in-money-screen"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-700 text-sm hover:bg-primary/90 active:scale-95 transition-all duration-150 shadow-lg shadow-primary/20"
            >
              See Your Year in Money →
            </Link>
            <Link
              href="/financial-health-screen"
              className="px-6 py-3 card-surface text-foreground rounded-xl font-600 text-sm hover:bg-muted transition-all"
            >
              Check Financial Health
            </Link>
          </>
        ) : (
          <>
            <button
              onClick={onNext}
              disabled={isProcessing}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-700 text-sm hover:bg-primary/90 active:scale-95 transition-all duration-150 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing && <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />}
              Continue to Month {currentMonth + 1} →
            </button>
            <Link
              href="/financial-health-screen"
              className="px-6 py-3 card-surface text-muted-foreground rounded-xl font-600 text-sm hover:text-foreground hover:bg-muted transition-all"
            >
              Check Health
            </Link>
          </>
        )}
      </div>
    </div>
  );
}