import React from 'react';

export default function LandingPayslip() {
  return (
    <section className="py-24 px-4 relative">
      <div className="absolute inset-0 bg-radial-purple opacity-50" />
      <div className="max-w-screen-xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-6">
              <span className="text-xs font-600 text-accent uppercase tracking-wide">The First Lesson</span>
            </div>
            <h2 className="text-4xl font-800 text-foreground mb-6 leading-tight">
              R25,000 earned.<br />
              <span className="text-gradient-gold">R21,442 received.</span><br />
              Now what?
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Before you spend a single rand, the government has already taken its share. Most people never stop to understand this gap — and it shapes every financial decision that follows.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              MoneyQuest starts here. With your real take-home pay. And then life begins.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { label: 'Month 1', desc: 'Payday. Apartment choice. First groceries.', cash: 'R21,441', icon: '🏠', color: 'text-primary' },
              { label: 'Month 3', desc: 'Transport decision. Family support request.', cash: 'R8,240', icon: '🚗', color: 'text-warning' },
              { label: 'Month 6', desc: 'Company restructure. 10% salary cut.', cash: 'R2,180', icon: '⚠️', color: 'text-negative' },
              { label: 'Month 9', desc: 'Medical bill. Emergency fund tested.', cash: 'R4,950', icon: '🛡️', color: 'text-positive' },
            ]?.map(item => (
              <div key={`payslip-${item?.label}`} className="card-surface p-4 rounded-xl flex items-center gap-4">
                <div className="text-2xl w-10 flex-shrink-0 text-center">{item?.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-600 text-muted-foreground mb-0.5">{item?.label}</div>
                  <div className="text-sm text-foreground truncate">{item?.desc}</div>
                </div>
                <div className={`font-mono text-sm font-700 flex-shrink-0 ${item?.color}`}>{item?.cash}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}