// Landing Screen — entry point
import React from 'react';
import LandingHero from './components/LandingHero';
import LandingFeatures from './components/LandingFeatures';
import LandingPayslip from './components/LandingPayslip';
import LandingCTA from './components/LandingCTA';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <LandingHero />
      <LandingPayslip />
      <LandingFeatures />
      <LandingCTA />
    </main>
  );
}