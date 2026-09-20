'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';

export default function LandingHero() {
  const [phase, setPhase] = useState<'initial' | 'gross' | 'net' | 'cta'>('initial');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('gross'), 600);
    const t2 = setTimeout(() => setPhase('net'), 1800);
    const t3 = setTimeout(() => setPhase('cta'), 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <section className="relative min-h-[100svh] flex flex-col items-center justify-start md:justify-center px-4 py-8 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-radial-gold" />
      <div className="absolute inset-0 bg-radial-purple" />
      <div className="absolute inset-0 noise-overlay pointer-events-none" />

      {/* Grid lines */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Topbar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 glass-card border-b border-border">
        <div className="max-w-screen-2xl mx-auto h-full px-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AppLogo size={32} />
            <span className="font-sans font-700 text-base tracking-tight text-foreground">
              MoneyQuest
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            {[
              { label: 'How it works', href: '#features' },
              { label: 'Play', href: '/game-simulation-screen' },
            ]?.map(item => (
              <Link
                key={`nav-${item?.label}`}
                href={item?.href}
                className="text-sm font-500 text-muted-foreground hover:text-foreground transition-colors"
              >
                {item?.label}
              </Link>
            ))}
            <Link
              href="/game-simulation-screen"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-600 hover:bg-primary/90 active:scale-95 transition-all duration-150"
            >
              Start Quest
            </Link>
          </nav>
          <Link
            href="/game-simulation-screen"
            className="md:hidden px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-600"
          >
            Play
          </Link>
        </div>
      </header>

      {/* Hero content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto pt-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
          <span className="text-lg">🇿🇦</span>
          <span className="text-sm font-500 text-primary">Built for young South African professionals</span>
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-800 leading-tight tracking-tight mb-6 animate-slide-up">
          <span className="text-foreground">Live your </span>
          <span className="text-gradient-gold">financial year</span>
          <br />
          <span className="text-foreground">before it happens.</span>
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed animate-slide-up">
          You just got the job. R25,000/month. Johannesburg. Now what?
          <br />
          <span className="text-foreground/80">12 months. Real decisions. Real consequences.</span>
        </p>

        {/* Salary reveal animation */}
        <div className="max-w-sm mx-auto mb-12">
          <div className="card-surface card-glow-gold p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
            <div className="text-xs font-600 text-muted-foreground uppercase tracking-wider mb-4">
              Your first payday
            </div>

            <div className={`transition-all duration-700 mb-3 ${phase === 'initial' ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Gross salary</span>
                <span className="font-mono font-600 text-foreground">R25,000.00</span>
              </div>
            </div>

            <div className={`transition-all duration-700 delay-300 ${phase === 'initial' || phase === 'gross' ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-negative">PAYE tax</span>
                <span className="font-mono font-600 text-negative">−R3,381.00</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-negative">UIF</span>
                <span className="font-mono font-600 text-negative">−R177.12</span>
              </div>
            </div>

            <div className={`transition-all duration-700 delay-500 mt-3 ${phase !== 'cta' ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
              <div className="flex justify-between items-center">
                <span className="text-sm font-600 text-foreground">You receive</span>
                <span className="font-mono font-700 text-2xl text-primary">R21,441.88</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                R25,000 is what you earn. R21,442 is what reaches you.
              </p>
            </div>
          </div>
        </div>

        <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 ${phase === 'cta' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Link
            href="/game-simulation-screen"
            className="px-8 py-4 bg-primary text-primary-foreground rounded-xl text-base font-700 hover:bg-primary/90 active:scale-95 transition-all duration-150 shadow-lg shadow-primary/20"
          >
            Start Your Quest →
          </Link>
          <a
            href="#features"
            className="px-8 py-4 card-surface text-foreground rounded-xl text-base font-600 hover:bg-muted transition-all duration-150"
          >
            How it works
          </a>
        </div>

        <p className="text-xs text-muted-foreground mt-6 animate-fade-in">
          No sign-up required · 8–12 minutes · Free to play
        </p>
      </div>

    </section>
  );
}
