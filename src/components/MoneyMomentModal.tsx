'use client';
import React, { useEffect, useState } from 'react';
import type { MoneyMoment } from '@/services/types';

interface MoneyMomentModalProps {
  moment: MoneyMoment | null;
  onDismiss: () => void;
}

export default function MoneyMomentModal({ moment, onDismiss }: MoneyMomentModalProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (moment) {
      setVisible(true);
    }
  }, [moment]);

  function handleDismiss() {
    setVisible(false);
    setTimeout(onDismiss, 300);
  }

  if (!moment) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={handleDismiss}
      />
      <div
        className={`relative max-w-lg w-full card-surface card-glow-gold p-8 transition-all duration-300 ${
          visible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

        <div className="text-center mb-6">
          <div className="text-5xl mb-4">{moment.emoji}</div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-600 text-primary tracking-wide uppercase">Money Moment</span>
          </div>
          <h2 className="text-2xl font-700 text-foreground">{moment.title}</h2>
        </div>

        <p className="text-base text-muted-foreground leading-relaxed mb-4 text-center">
          {moment.narrative}
        </p>

        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mb-6">
          <p className="text-sm font-500 text-accent-foreground leading-relaxed">
            💡 {moment.insight}
          </p>
        </div>

        <button
          onClick={handleDismiss}
          className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-600 text-sm hover:bg-primary/90 active:scale-95 transition-all duration-150"
        >
          Got it — continue
        </button>
      </div>
    </div>
  );
}