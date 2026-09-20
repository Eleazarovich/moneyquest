import React from 'react';
import Link from 'next/link';

export default function LandingCTA() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-radial-gold opacity-60" />
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <div className="text-6xl mb-6">🚀</div>
        <h2 className="text-4xl sm:text-5xl font-800 text-foreground mb-6 leading-tight">
          Same starting point.<br />
          <span className="text-gradient-gold">Different decisions.</span><br />
          Different future.
        </h2>
        <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
          8–12 minutes. No sign-up. Start right now and see what your first year of financial independence actually looks like.
        </p>
        <Link
          href="/game-simulation-screen"
          className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-primary-foreground rounded-2xl text-lg font-700 hover:bg-primary/90 active:scale-95 transition-all duration-150 shadow-2xl shadow-primary/30"
        >
          <span>Start Your Quest</span>
          <span className="text-xl">→</span>
        </Link>
        <p className="text-sm text-muted-foreground mt-6">
          Age 24 · Johannesburg · R25,000/month · Month 1 of 12
        </p>

        <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="text-positive">✓</span>
            <span>No real money involved</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-positive">✓</span>
            <span>No personal data collected</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-positive">✓</span>
            <span>Completely free to play</span>
          </div>
        </div>
      </div>
    </section>
  );
}