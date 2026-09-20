import React from 'react';

interface MonthHeaderProps {
  month: number;
  isProcessing: boolean;
}

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTH_NARRATIVES: Record<number, string> = {
  1: 'Your first proper payday. The city is new, the salary is real, and decisions are waiting.',
  2: 'Month two. The novelty is wearing off. Life is getting more expensive.',
  3: 'Three months in. Patterns are forming. Commitments are stacking.',
  4: 'Work social life is ramping up. Pressure to look the part.',
  5: 'Halfway through the first half-year. Time to take stock.',
  6: 'Six months in. The year is turning. Surprises can arrive.',
  7: 'Second half of the year begins. Life doesn\'t slow down.',
  8: 'FOMO season. Your friends\' lifestyle is visible everywhere.',
  9: 'The year is winding down — but the bills aren\'t.',
  10: 'Decisions from Month 1 are fully visible now.',
  11: 'Year-end social season. Pressure and parties.',
  12: 'Final month. Every decision this year is about to make sense.',
};

export default function MonthHeader({ month, isProcessing }: MonthHeaderProps) {
  const monthName = MONTH_NAMES[(month - 1) % 12];
  const year = 2025 + Math.ceil(month / 12);
  const narrative = MONTH_NARRATIVES[month] ?? 'Another month. Another set of choices.';

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-2">
        <div className="month-badge px-4 py-1.5 rounded-full">
          <span className="text-sm font-700 text-primary">Month {month}</span>
        </div>
        <span className="text-muted-foreground text-sm">{monthName} {year}</span>
        {isProcessing && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className="w-3 h-3 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />
            Processing…
          </div>
        )}
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{narrative}</p>
    </div>
  );
}