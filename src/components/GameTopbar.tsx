import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';

interface GameTopbarProps {
  currentMonth?: number;
  availableCash?: number;
  showCash?: boolean;
  phase?: string;
}

export default function GameTopbar({
  currentMonth,
  availableCash,
  showCash = false,
  phase,
}: GameTopbarProps) {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 glass-card border-b border-border">
      <div className="max-w-screen-2xl mx-auto h-full px-4 lg:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <AppLogo size={32} />
          <span className="font-sans font-700 text-base tracking-tight text-foreground hidden sm:block">
            MoneyQuest
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {currentMonth && currentMonth > 0 && (
            <div className="flex items-center gap-2">
              <div className="month-badge px-3 py-1 rounded-full text-xs font-semibold text-primary">
                Month {currentMonth} — {monthNames[(currentMonth - 1) % 12]}
              </div>
              <div className="hidden sm:flex gap-1">
                {Array.from({ length: 12 }, (_, i) => (
                  <div
                    key={`month-pip-${i + 1}`}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      i + 1 < currentMonth
                        ? 'bg-primary'
                        : i + 1 === currentMonth
                        ? 'bg-primary animate-pulse' :'bg-muted-foreground/30'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {showCash && availableCash !== undefined && (
            <div className="card-surface px-3 py-1.5 rounded-lg">
              <span className="text-xs text-muted-foreground mr-1.5">Available</span>
              <span
                className={`font-mono text-sm font-600 ${
                  availableCash < 1000
                    ? 'text-negative'
                    : availableCash < 3000
                    ? 'text-warning' :'text-positive'
                }`}
              >
                R{availableCash.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}

          <nav className="hidden md:flex items-center gap-1">
            {[
              { label: 'Health', href: '/financial-health-screen' },
              { label: 'Year', href: '/year-in-money-screen' },
              { label: 'What-If', href: '/what-if-future-you-screen' },
            ].map(link => (
              <Link
                key={`nav-${link.href}`}
                href={link.href}
                className="px-3 py-1.5 text-xs font-500 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}