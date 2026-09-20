import React from 'react';

const features = [
  {
    id: 'feat-experience',
    emoji: '🎭',
    title: 'Experience first. Explanation second.',
    description: 'No warnings before you choose. No "bad choice" labels. Make the decision a real person would make — then live with it.',
  },
  {
    id: 'feat-no-gameover',
    emoji: '♾️',
    title: 'No game over. Ever.',
    description: "Bad finances narrow your choices and force harder trade-offs. But you always reach Month 12. Just like real life.",
  },
  {
    id: 'feat-real',
    emoji: '🇿🇦',
    title: 'Real South African context.',
    description: 'PAYE, UIF, Johannesburg rents, Gautrain fares, store accounts, load shedding surprises. This is your financial world.',
  },
  {
    id: 'feat-replay',
    emoji: '🔄',
    title: 'Same start. Different choices.',
    description: "Every replay begins at R25,000 gross, age 24, Johannesburg. What changes is you. See how different decisions create different lives.",
  },
  {
    id: 'feat-moments',
    emoji: '💡',
    title: 'Money Moments that stick.',
    description: "Short, sharp insights triggered by your own behaviour. \"Your apartment didn't cost R9,500. It cost R114,000.\"",
  },
  {
    id: 'feat-health',
    emoji: '🛡️',
    title: 'Five dimensions. No single score.',
    description: 'Resilience. Liquidity. Debt load. Saving habit. Lifestyle balance. Real financial health is multidimensional.',
  },
];

export default function LandingFeatures() {
  return (
    <section id="features" className="py-24 px-4">
      <div className="max-w-screen-xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-800 text-foreground mb-4">
            A different kind of{' '}
            <span className="text-gradient-gold">financial education</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Not a course. Not a quiz. A simulation you live through.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {features?.map(f => (
            <div key={f?.id} className="card-surface p-6 rounded-2xl hover:border-primary/30 transition-all duration-300 group">
              <div className="text-4xl mb-4">{f?.emoji}</div>
              <h3 className="text-lg font-700 text-foreground mb-2 group-hover:text-primary transition-colors">
                {f?.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f?.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}