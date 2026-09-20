'use client';
import React, { useState, useEffect } from 'react';
import type { TaxConfiguration } from '@/services/types';

interface PayslipRevealProps {
  onContinue: () => void;
  taxConfiguration: TaxConfiguration;
}

export default function PayslipReveal({ onContinue, taxConfiguration }: PayslipRevealProps) {
  const [step, setStep] = useState(0);
  const formatAmount = (amount: number) => `R${amount.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const taxYear = taxConfiguration.taxYear.replace('-', '/');

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 500),
      setTimeout(() => setStep(2), 1200),
      setTimeout(() => setStep(3), 2000),
      setTimeout(() => setStep(4), 2800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="min-h-[100svh] bg-background flex flex-col items-center justify-start md:justify-center px-4 pt-24 pb-8 md:py-20 relative overflow-y-auto">
      <div className="absolute inset-0 bg-radial-gold opacity-60" />
      <div className="relative z-10 max-w-lg w-full">
        <div className="text-center mb-8">
          <div className={`text-6xl mb-4 transition-all duration-500 ${step >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
            🎉
          </div>
          <h1 className={`text-3xl font-800 text-foreground mb-2 transition-all duration-500 ${step >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            You got the job.
          </h1>
          <p className={`text-muted-foreground transition-all duration-500 delay-100 ${step >= 1 ? 'opacity-100' : 'opacity-0'}`}>
            First day at work. First payday incoming.
          </p>
        </div>

        <div className="card-surface card-glow-gold rounded-2xl overflow-hidden">
          <div className="bg-primary/10 border-b border-border px-6 py-4">
            <div className="text-xs font-600 text-primary uppercase tracking-wider">
              Payslip — Month 1 · October 2026
            </div>
            <div className="text-sm text-muted-foreground mt-0.5">
              Fictional Employer (Pty) Ltd · Employee: You
            </div>
          </div>

          <div className="p-6 space-y-3">
            <div className={`flex justify-between items-center py-2 border-b border-border transition-all duration-500 ${step >= 1 ? 'opacity-100' : 'opacity-0'}`}>
              <div>
                <div className="text-sm font-500 text-foreground">Gross Salary</div>
                <div className="text-xs text-muted-foreground">Monthly CTC</div>
              </div>
              <div className="font-mono font-700 text-lg text-foreground">{formatAmount(taxConfiguration.grossSalary)}</div>
            </div>

            <div className={`space-y-2 transition-all duration-500 delay-200 ${step >= 2 ? 'opacity-100' : 'opacity-0'}`}>
              <div className="text-xs font-600 text-muted-foreground uppercase tracking-wide">Deductions</div>
              <div className="flex justify-between items-center py-1.5">
                <div>
                  <div className="text-sm text-muted-foreground">PAYE (Income Tax)</div>
                  <div className="text-xs text-muted-foreground/60">{taxYear} tax year</div>
                </div>
                <div className="font-mono text-sm font-600 text-negative">−{formatAmount(taxConfiguration.paye)}</div>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-border">
                <div>
                  <div className="text-sm text-muted-foreground">UIF Contribution</div>
                  <div className="text-xs text-muted-foreground/60">1% of remuneration</div>
                </div>
                <div className="font-mono text-sm font-600 text-negative">−{formatAmount(taxConfiguration.uif)}</div>
              </div>
            </div>

            <div className={`flex justify-between items-center pt-2 transition-all duration-700 delay-300 ${step >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
              <div>
                <div className="text-base font-700 text-foreground">Take-Home Pay</div>
                <div className="text-xs text-muted-foreground">Deposited to your account</div>
              </div>
              <div className="font-mono font-800 text-2xl text-primary">{formatAmount(taxConfiguration.netSalary)}</div>
            </div>
          </div>

          <div className={`px-6 pb-4 transition-all duration-500 delay-400 ${step >= 3 ? 'opacity-100' : 'opacity-0'}`}>
            <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground leading-relaxed">
              {formatAmount(taxConfiguration.grossSalary)} is what you earn. About <span className="text-foreground font-600">{formatAmount(taxConfiguration.netSalary)}</span> is what reaches you in this scenario. Every rand you see in this quest is your take-home money.
            </div>
          </div>
        </div>

        <div className={`mt-6 transition-all duration-500 ${step >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <button
            onClick={onContinue}
            className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-700 text-base hover:bg-primary/90 active:scale-95 transition-all duration-150 shadow-lg shadow-primary/20"
          >
            Start Month 1 →
          </button>
          <p className="text-center text-xs text-muted-foreground mt-3">
            Johannesburg · October 2026 · Age 24
          </p>
        </div>
      </div>
    </div>
  );
}
