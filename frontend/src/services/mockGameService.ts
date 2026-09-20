// MOCK IMPLEMENTATION — replace with real API calls to /api/* endpoints when backend is ready
import type { GameService, PlayerState, LifeEvent, Decision, Transaction, MoneyMoment, FinancialHealthSnapshot, YearInMoneySummary, WhatIfFork, TaxConfiguration, HealthState,  } from './types';

// ─── Tax Configuration (2026/27) ────────────────────────────────────────────
const TAX_CONFIG: TaxConfiguration = {
  taxYear: '2026/27',
  grossSalary: 25000,
  paye: 3381.00,
  uif: 177.12,
  netSalary: 21441.88,
};

// ─── In-memory store (replaces database) ────────────────────────────────────
const runStore: Record<string, PlayerState> = {};

// ─── Seeded RNG ──────────────────────────────────────────────────────────────
function seededRandom(seed: number, index: number): number {
  const x = Math.sin(seed + index) * 10000;
  return x - Math.floor(x);
}

// ─── Decision Library ────────────────────────────────────────────────────────
const DECISIONS: Record<string, Decision> = {
  'decision-housing': {
    id: 'decision-housing',
    title: 'Where will you live?',
    narrative: "You've got the job. Now you need a place to call home in Johannesburg. You've shortlisted three options. Each has its appeal.",
    context: "Your first full-time payday just landed. Time to sort out where you'll live.",
    month: 1,
    category: 'Housing',
    options: [
      {
        id: 'opt-housing-basic',
        label: 'Roodepoort Flatlet',
        description: 'A practical studio in Roodepoort. Older building, no frills, but yours. 30 min commute. Water and lights included.',
        cost: 500,
        monthlyCommitment: 6500,
        commitmentName: 'Rent — Roodepoort',
        emoji: '🏠',
        tag: 'Affordable',
        lifestyle: 'Practical, independent, low-pressure',
      },
      {
        id: 'opt-housing-mid',
        label: 'Braamfontein 1-Bed',
        description: 'Trendy Braamfontein apartment. Walking distance to coffee shops, close to the CBD. Modern finishes, secure parking, fibre-ready.',
        cost: 1000,
        monthlyCommitment: 9500,
        commitmentName: 'Rent — Braamfontein',
        emoji: '🏙️',
        tag: 'Popular',
        lifestyle: 'Urban, social, aspirational',
      },
      {
        id: 'opt-housing-premium',
        label: 'Sandton Studio',
        description: 'Sleek Sandton studio with gym, pool, and concierge. The address that impresses. Walking distance to Sandton City.',
        cost: 2000,
        monthlyCommitment: 13500,
        commitmentName: 'Rent — Sandton',
        emoji: '✨',
        tag: 'Aspirational',
        lifestyle: 'Premium, status, central',
      },
    ],
  },
  'decision-phone': {
    id: 'decision-phone',
    title: 'Your phone is showing its age.',
    narrative: "Your current phone's screen has a crack and the battery barely lasts a day. A colleague mentions the new Samsung Galaxy S25 just dropped. You check it out on your lunch break.",
    context: 'Month 2. You have some cash but commitments are building.',
    month: 2,
    category: 'Smartphone',
    options: [
      {
        id: 'opt-phone-keep',
        label: 'Keep the old phone',
        description: 'Get the screen repaired for R450. Not glamorous, but it works.',
        cost: 450,
        emoji: '🔧',
        tag: 'Practical',
        lifestyle: 'Sensible, patient',
      },
      {
        id: 'opt-phone-mid',
        label: 'Samsung Galaxy A55',
        description: 'Great mid-range phone. R8,999 upfront or R299/month on a 24-month contract.',
        cost: 299,
        monthlyCommitment: 299,
        commitmentName: 'Phone contract — Galaxy A55',
        emoji: '📱',
        tag: 'Smart choice',
        lifestyle: 'Connected, practical',
      },
      {
        id: 'opt-phone-premium',
        label: 'Samsung Galaxy S25',
        description: "The one everyone's talking about. R22,999 or R649/month on a 36-month contract. Pay R1,500 deposit today.",
        cost: 1500,
        monthlyCommitment: 649,
        commitmentName: 'Phone contract — Galaxy S25',
        emoji: '🌟',
        tag: 'Premium',
        lifestyle: 'Status, cutting-edge',
        debtOffer: {
          provider: 'FlexiTalk Network',
          depositRequired: 1500,
          monthlyRepayment: 649,
          term: 36,
        },
      },
    ],
  },
  'decision-transport': {
    id: 'decision-transport',
    title: 'How will you get around?',
    narrative: "Three months in and the Gautrain + Uber combo is eating more than you thought. A friend is selling their 2019 Toyota Corolla. The bank has a pre-approval waiting.",
    context: 'Month 3. Your transport costs are unpredictable.',
    month: 3,
    category: 'Transport',
    options: [
      {
        id: 'opt-transport-public',
        label: 'Gautrain + Uber',
        description: 'Keep using public transport and Uber for convenience. No fixed commitment, but variable monthly cost of around R1,800.',
        cost: 0,
        monthlyCommitment: 1800,
        commitmentName: 'Transport — Gautrain/Uber',
        emoji: '🚇',
        tag: 'Flexible',
        lifestyle: 'Urban, sustainable',
      },
      {
        id: 'opt-transport-car',
        label: 'Buy the Corolla',
        description: "2019 Toyota Corolla, 68k km. R189,000. Pay R15,000 deposit, finance the rest at R3,850/month over 60 months. Add insurance: R850/month.",
        cost: 15000,
        monthlyCommitment: 4700,
        commitmentName: 'Car payment + insurance',
        emoji: '🚗',
        tag: 'Freedom',
        lifestyle: 'Independent, status',
        debtOffer: {
          provider: 'QuickDrive Finance',
          depositRequired: 15000,
          monthlyRepayment: 3850,
          term: 60,
        },
      },
    ],
  },
  'decision-clothing': {
    id: 'decision-clothing',
    title: 'Big work function coming up.',
    narrative: "Your company's client dinner is next week. Your manager mentioned it's a smart-casual event at a Sandton restaurant. You want to look the part.",
    context: 'Month 4. Work social life is ramping up.',
    month: 4,
    category: 'Clothing',
    options: [
      {
        id: 'opt-clothing-basic',
        label: 'Work with what you have',
        description: 'Dress up what you already own. Maybe buy one item from Woolworths for R600.',
        cost: 600,
        emoji: '👔',
        tag: 'Resourceful',
      },
      {
        id: 'opt-clothing-mid',
        label: 'Zara outfit (R2,400)',
        description: 'A sharp Zara outfit that works for work and going out. Pay cash.',
        cost: 2400,
        emoji: '🛍️',
        tag: 'Stylish',
      },
      {
        id: 'opt-clothing-account',
        label: 'Stuttafords store account',
        description: 'Open a store account. Get R4,500 of clothing today. Pay R450/month over 12 months. No deposit.',
        cost: 0,
        monthlyCommitment: 450,
        commitmentName: 'Stuttafords account',
        emoji: '💳',
        tag: 'Buy now',
        debtOffer: {
          provider: 'Stuttafords Credit',
          depositRequired: 0,
          monthlyRepayment: 450,
          term: 12,
        },
      },
    ],
  },
  'decision-savings': {
    id: 'decision-savings',
    title: 'Build your financial foundation?',
    narrative: "Five months in and you're starting to see patterns. Your available cash varies wildly month to month. A colleague mentions she puts away R1,000 every payday without thinking about it.",
    context: 'Month 5. A moment of reflection.',
    month: 5,
    category: 'Savings',
    options: [
      {
        id: 'opt-savings-none',
        label: "Skip it for now",
        description: "You have expenses. You'll start saving when things settle down.",
        cost: 0,
        emoji: '⏳',
        tag: 'Later',
      },
      {
        id: 'opt-savings-small',
        label: 'Save R500/month',
        description: 'Set up a recurring transfer to a separate emergency savings pocket.',
        cost: 500,
        monthlyCommitment: 500,
        commitmentName: 'Emergency savings — R500',
        emoji: '🛡️',
        tag: 'Start small',
      },
      {
        id: 'opt-savings-serious',
        label: 'Save R1,000/month',
        description: 'Commit R1,000 every payday to a dedicated emergency fund.',
        cost: 1000,
        monthlyCommitment: 1000,
        commitmentName: 'Emergency savings — R1,000',
        emoji: '💪',
        tag: 'Committed',
      },
    ],
  },
  'decision-bnpl': {
    id: 'decision-bnpl',
    title: 'Your friends are going to Bali.',
    narrative: "Eight of your friends are booking a 5-day trip to Bali for R14,500 all-in. The deal closes in 48 hours. PayLater SA is offering: R3,625 today, then three monthly instalments of R3,625.",
    context: 'Month 8. FOMO is real.',
    month: 8,
    category: 'Travel',
    options: [
      {
        id: 'opt-bnpl-skip',
        label: 'Skip this one',
        description: "You'd love to go but the timing isn't right. Your friends will understand.",
        cost: 0,
        emoji: '🏠',
        tag: 'Responsible',
      },
      {
        id: 'opt-bnpl-cash',
        label: 'Pay cash (R14,500)',
        description: "Pay the full amount upfront. You'll need to dip into savings or existing cash.",
        cost: 14500,
        emoji: '✈️',
        tag: 'Full pay',
      },
      {
        id: 'opt-bnpl-split',
        label: 'Use PayLater SA',
        description: 'R3,625 today, then R3,625/month for 3 months. Go now, pay later.',
        cost: 3625,
        monthlyCommitment: 3625,
        commitmentName: 'PayLater SA — Bali trip',
        emoji: '🌴',
        tag: 'BNPL',
        debtOffer: {
          provider: 'PayLater SA',
          depositRequired: 3625,
          monthlyRepayment: 3625,
          term: 3,
        },
      },
    ],
  },
  'decision-housing-upgrade': {
    id: 'decision-housing-upgrade',
    title: 'Your lease is up for renewal.',
    narrative: "Your 12-month lease is ending. Your landlord is offering a renewal. But you've also seen a nicer place nearby, and a cheaper option if you want to cut costs.",
    context: 'Month 10. Re-evaluate your housing.',
    month: 10,
    category: 'Housing',
    options: [
      {
        id: 'opt-housing-downgrade',
        label: 'Move somewhere cheaper',
        description: 'Find a cheaper flat to free up R2,000–3,000/month. Less impressive but more sustainable.',
        cost: 1500,
        monthlyCommitment: -2000,
        commitmentName: 'Housing adjustment',
        emoji: '📦',
        tag: 'Downsize',
      },
      {
        id: 'opt-housing-renew',
        label: 'Renew your current lease',
        description: 'Stay where you are. Comfortable, familiar. Small 5% increase.',
        cost: 0,
        emoji: '🔄',
        tag: 'Stable',
      },
      {
        id: 'opt-housing-upgrade',
        label: 'Upgrade to better place',
        description: 'A newer building, better area, R2,500 more per month. Worth it?',
        cost: 2000,
        monthlyCommitment: 2500,
        commitmentName: 'Housing upgrade premium',
        emoji: '⬆️',
        tag: 'Upgrade',
      },
    ],
  },
};

// ─── Life Events Library ─────────────────────────────────────────────────────
const LIFE_EVENTS: LifeEvent[] = [
  {
    id: 'event-concert-m2',
    month: 2,
    type: 'social',
    title: 'Sho Madjozi concert this weekend',
    narrative: "Your friends are going to the Sho Madjozi concert at the Ticketpro Dome. Tickets are R850. \"You're coming, right?\"",
    emoji: '🎵',
    cashEffect: -850,
    transactionType: 'ENTERTAINMENT',
    triggersDecision: false,
    probability: 0.8,
  },
  {
    id: 'event-family-m3',
    month: 3,
    type: 'family',
    title: 'Your mom needs help',
    narrative: "Your mother calls. The fridge broke down. She doesn't ask directly, but you can hear it in her voice. Replacing it costs R4,200. You could send what you can.",
    emoji: '👩‍👧',
    cashEffect: -2500,
    transactionType: 'FAMILY_SUPPORT',
    triggersDecision: false,
    probability: 0.65,
  },
  {
    id: 'event-side-hustle-m5',
    month: 5,
    type: 'career',
    title: 'Side hustle opportunity',
    narrative: "A friend needs a freelance logo designed. You have the skills. They're offering R3,500 for the project, payable on delivery.",
    emoji: '💼',
    cashEffect: 3500,
    transactionType: 'SIDE_INCOME',
    triggersDecision: false,
    probability: 0.55,
  },
  {
    id: 'event-phone-damage-m5',
    month: 5,
    type: 'unexpected',
    title: 'Phone screen cracked',
    narrative: "You dropped your phone on the way to the office. The screen is cracked. Repair: R1,200 at a certified shop, or R650 at a local repair place.",
    emoji: '📱',
    cashEffect: -1200,
    transactionType: 'EMERGENCY_EXPENSE',
    triggersDecision: false,
    probability: 0.45,
  },
  {
    id: 'event-income-shock-m6',
    month: 6,
    type: 'income_shock',
    title: 'Company restructure',
    narrative: "Your manager calls you in. \"We're restructuring the department. Your role is safe, but there'll be no increases this year, and we need to discuss a temporary 10% salary reduction for two months.\"",
    emoji: '⚠️',
    cashEffect: -2144,
    transactionType: 'SALARY_NET',
    triggersDecision: false,
    probability: 0.4,
  },
  {
    id: 'event-date-m7',
    month: 7,
    type: 'relationship',
    title: 'Someone special',
    narrative: "You've been seeing someone. They suggest a dinner at a nice restaurant in Melrose Arch — the kind of place where mains are R280. Plus drinks. The bill comes to R1,850.",
    emoji: '💛',
    cashEffect: -1850,
    transactionType: 'ENTERTAINMENT',
    triggersDecision: false,
    probability: 0.7,
  },
  {
    id: 'event-medical-m9',
    month: 9,
    type: 'unexpected',
    title: 'Unexpected medical bill',
    narrative: "You've been putting off that tooth. It got worse. The dentist says you need a filling and a crown. Without medical aid, the bill is R4,800.",
    emoji: '🦷',
    cashEffect: -4800,
    transactionType: 'EMERGENCY_EXPENSE',
    triggersDecision: false,
    probability: 0.5,
  },
  {
    id: 'event-bonus-m9',
    month: 9,
    type: 'career',
    title: 'Performance bonus',
    narrative: "Your manager sends a calendar invite: \"Q3 performance review.\" You've done well. The bonus: R5,000 deposited with this month's salary.",
    emoji: '🎉',
    cashEffect: 5000,
    transactionType: 'BONUS',
    triggersDecision: false,
    probability: 0.45,
  },
  {
    id: 'event-yearend-party-m11',
    month: 11,
    type: 'social',
    title: 'Year-end social season',
    narrative: "November hits and the invites start flooding in. Work year-end function (R0), friends' year-end dinner (R600 split), cousin's birthday braai (gift R350). Social pressure is real.",
    emoji: '🥂',
    cashEffect: -950,
    transactionType: 'ENTERTAINMENT',
    triggersDecision: false,
    probability: 0.9,
  },
  {
    id: 'event-electricity-m2',
    month: 2,
    type: 'unexpected',
    title: 'Electricity bill spike',
    narrative: "Your first electricity bill arrives. You didn't realise the geyser was set so high. R1,450 — more than you expected.",
    emoji: '⚡',
    cashEffect: -1450,
    transactionType: 'UTILITIES',
    triggersDecision: false,
    probability: 0.75,
  },
  {
    id: 'event-groceries-m1',
    month: 1,
    type: 'unexpected',
    title: 'Stocking up your new place',
    narrative: "Moving into your new place means buying everything from scratch. Groceries, cleaning supplies, basic household items. The first Woolworths Food run sets you back R2,800.",
    emoji: '🛒',
    cashEffect: -2800,
    transactionType: 'GROCERIES',
    triggersDecision: false,
    probability: 1.0,
  },
  {
    id: 'event-internet-m1',
    month: 1,
    type: 'unexpected',
    title: 'Fibre connection',
    narrative: "You need internet at home. Vumatel fibre is available. R699/month for 100Mbps — sign up for 12 months.",
    emoji: '📶',
    cashEffect: -699,
    transactionType: 'UTILITIES',
    triggersDecision: false,
    probability: 1.0,
  },
  {
    id: 'event-weekend-trip-m7',
    month: 7,
    type: 'social',
    title: 'Weekend away in the Drakensberg',
    narrative: "Your friend group is heading to a lodge in the Drakensberg for a long weekend. R2,200 per person for accommodation, plus petrol and food.",
    emoji: '🏔️',
    cashEffect: -3200,
    transactionType: 'ENTERTAINMENT',
    triggersDecision: false,
    probability: 0.5,
  },
  {
    id: 'event-credit-offer-m4',
    month: 4,
    type: 'career',
    title: 'Pre-approved credit card offer',
    narrative: "A letter arrives: \"Congratulations! You've been pre-approved for a ZeroFlex Gold Card. R25,000 limit. No annual fee for the first year. Apply in 2 minutes.\"",
    emoji: '💳',
    cashEffect: 0,
    transactionType: 'DEBT_DISBURSEMENT',
    triggersDecision: false,
    probability: 0.8,
  },
];

// ─── Money Moment Library ─────────────────────────────────────────────────────
const MONEY_MOMENTS: Record<string, MoneyMoment> = {
  'mm-payday-smaller': {
    id: 'mm-payday-smaller',
    title: 'Payday Got Smaller',
    narrative: "You earned R25,000 this month. But after PAYE and UIF, only R21,441.88 reached your account. And after your recurring commitments, you actually had much less to work with.",
    insight: "Your salary is not your income. Your income is not your spending money. Understanding this gap is the first step to taking control.",
    emoji: '📊',
    triggerCondition: 'FIRST_PAYDAY',
  },
  'mm-where-did-money-go': {
    id: 'mm-where-did-money-go',
    title: 'Where Did My Money Go?',
    narrative: "You started this month with R21,441.88. Somehow you're looking at less than R3,000 left. Let's trace what happened.",
    insight: "Every individual expense felt reasonable in isolation. The surprise isn't any single decision — it's how they compound.",
    emoji: '🔍',
    triggerCondition: 'LOW_CASH',
  },
  'mm-tomorrows-money': {
    id: 'mm-tomorrows-money',
    title: "Tomorrow's Money",
    narrative: "You took on a commitment that comes out of next month's salary — before you've even earned it. This month's problem became next month's smaller payday.",
    insight: "Debt doesn't solve cash problems. It moves them forward in time, usually with interest.",
    emoji: '⏰',
    triggerCondition: 'DEBT_TAKEN',
  },
  'mm-real-cost-apartment': {
    id: 'mm-real-cost-apartment',
    title: 'The Real Cost of Your Apartment',
    narrative: "Your rent is R9,500/month. But that's not what your apartment actually costs you. Add electricity (R1,450), internet (R699), and the initial moving costs, and the picture changes.",
    insight: "The advertised price of a home is never the full price. Budget for the total cost of living somewhere, not just the headline rent.",
    emoji: '🏠',
    triggerCondition: 'AFTER_HOUSING_DECISION',
  },
  'mm-annual-number': {
    id: 'mm-annual-number',
    title: 'The Annual Number',
    narrative: "R9,500 a month doesn't feel overwhelming. But R9,500 × 12 = R114,000. That's what your apartment costs you annually — before electricity and internet.",
    insight: "Monthly costs are designed to feel manageable. Annual costs reveal the real scale of your commitments.",
    emoji: '📅',
    triggerCondition: 'MONTH_3',
  },
  'mm-debt-loop': {
    id: 'mm-debt-loop',
    title: 'The Debt Loop',
    narrative: "You needed cash this month. But part of why you needed cash is that last month's debt repayments consumed so much of your payday. Debt creates the conditions for more debt.",
    insight: "This is the debt cycle. Breaking it requires either more income, reduced spending, or both — and it doesn't happen by itself.",
    emoji: '🔄',
    triggerCondition: 'DEBT_CYCLE',
  },
  'mm-shield-worked': {
    id: 'mm-shield-worked',
    title: 'Your Shield Worked',
    narrative: "That unexpected expense would have pushed many people into debt. Because you'd been saving, you absorbed it without borrowing. Your financial shield held.",
    insight: "Emergency savings aren't about earning more. They're about being able to absorb life's inevitable surprises without falling behind.",
    emoji: '🛡️',
    triggerCondition: 'EMERGENCY_ABSORBED',
  },
  'mm-lifestyle-creep': {
    id: 'mm-lifestyle-creep',
    title: 'Lifestyle Creep',
    narrative: "A few months ago, your fixed commitments were R8,000/month. Now they're nearly R14,000. Your salary hasn't changed. Your lifestyle has expanded to fill your income.",
    insight: "Lifestyle creep is invisible in the moment. Each upgrade feels earned. The cumulative effect is that more income creates the same financial pressure.",
    emoji: '📈',
    triggerCondition: 'COMMITMENTS_GREW',
  },
  'mm-small-habit': {
    id: 'mm-small-habit',
    title: 'Small Habit, Big Result',
    narrative: "You've been saving R1,000 a month for the past several months. It didn't feel like much at the time. But it has quietly grown into a meaningful cushion.",
    insight: "The best financial habits feel trivial when you start them. Their value is only visible in retrospect — or when you need them.",
    emoji: '🌱',
    triggerCondition: 'SAVINGS_MILESTONE',
  },
  'mm-convenience-cost': {
    id: 'mm-convenience-cost',
    title: 'The Cost of Convenience',
    narrative: "Uber Eats here. Mr D Food there. A quick Checkers Sixty60 run. Each one felt small. Together they added up to more than you'd guess.",
    insight: "Convenience spending rarely feels like a decision. That's what makes it powerful — and expensive.",
    emoji: '🛵',
    triggerCondition: 'HIGH_CONVENIENCE',
  },
};

// ─── Helper functions ─────────────────────────────────────────────────────────
function generateRunId(): string {
  return `run-${Date.now()}-${Math.floor(Math.random() * 9999)}`;
}

function generateTransactionId(prefix: string, month: number, index: number): string {
  return `txn-${prefix}-m${month}-${index}`;
}

function getHealthState(value: number, thresholds: [number, number, number, number, number]): HealthState {
  if (value >= thresholds[0]) return 'Strong';
  if (value >= thresholds[1]) return 'Healthy';
  if (value >= thresholds[2]) return 'Stable';
  if (value >= thresholds[3]) return 'Building';
  if (value >= thresholds[4]) return 'Vulnerable';
  return 'Critical';
}

function calculateFinancialHealth(state: PlayerState): FinancialHealthSnapshot {
  const emergencyFund = state.savingsBuckets.find(b => b.isEmergencyFund)?.balance ?? 0;
  const monthlyExpenses = Object.values(state.monthlySpendByCategory).reduce((a, b) => a + b, 0) || 8000;
  const resilienceMonths = emergencyFund / (monthlyExpenses || 1);
  const resilienceState = getHealthState(resilienceMonths, [3, 2, 1, 0.5, 0.1]);

  const liquidityState = getHealthState(state.availableCash, [10000, 6000, 3000, 1000, 500]);

  const totalDebtRepayments = state.debts.reduce((sum, d) => sum + d.monthlyRepayment, 0);
  const debtRatio = totalDebtRepayments / TAX_CONFIG.netSalary;
  const debtLoadState = getHealthState(1 - debtRatio, [1, 0.9, 0.8, 0.7, 0.6]);

  const savingRatio = state.monthsWithSavings / Math.max(state.currentMonth, 1);
  const savingHabitState = getHealthState(savingRatio, [1, 0.75, 0.5, 0.25, 0.01]);

  const totalFixed = state.recurringCommitments.filter(c => c.active).reduce((sum, c) => sum + c.amount, 0);
  const lifestyleRatio = totalFixed / TAX_CONFIG.netSalary;
  const lifestyleState = getHealthState(1 - lifestyleRatio, [0.6, 0.5, 0.4, 0.3, 0.2]);

  return {
    month: state.currentMonth,
    resilience: {
      state: resilienceState,
      value: Math.round(resilienceMonths * 10) / 10,
      explanation: `Your emergency fund covers ${resilienceMonths.toFixed(1)} months of expenses. ${resilienceState === 'Strong' ? 'Excellent buffer against shocks.' : resilienceState === 'Critical' ? 'One unexpected expense could push you into debt.' : 'Keep building this.'}`,
    },
    liquidity: {
      state: liquidityState,
      value: state.availableCash,
      explanation: `You have R${state.availableCash.toLocaleString('en-ZA', { minimumFractionDigits: 2 })} available right now. ${liquidityState === 'Critical' ? 'Very low — a small expense could cause real difficulty.' : liquidityState === 'Strong' ? 'Good breathing room for discretionary spending.' : 'Manageable but watch your spending.'}`,
    },
    debtLoad: {
      state: debtLoadState,
      value: Math.round(debtRatio * 100),
      explanation: `${Math.round(debtRatio * 100)}% of your take-home pay is committed to debt repayments (R${totalDebtRepayments.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}/month). ${debtLoadState === 'Critical' ? 'This is consuming your future income significantly.' : debtLoadState === 'Strong' ? 'Minimal debt pressure.' : 'Manageable but growing.'}`,
    },
    savingHabit: {
      state: savingHabitState,
      value: state.monthsWithSavings,
      explanation: `You saved in ${state.monthsWithSavings} of ${state.currentMonth} months played. ${savingHabitState === 'Strong' ? 'Excellent consistency.' : savingHabitState === 'Critical' ? "You haven't established a saving habit yet." : 'Building a habit takes repetition.'}`,
    },
    lifestyleBalance: {
      state: lifestyleState,
      value: Math.round(lifestyleRatio * 100),
      explanation: `${Math.round(lifestyleRatio * 100)}% of your take-home pay goes to fixed commitments (R${totalFixed.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}/month). ${lifestyleState === 'Critical' ? 'Your lifestyle is consuming most of your income.' : lifestyleState === 'Strong' ? 'Healthy balance between commitments and flexibility.' : 'Watch for further commitments.'}`,
    },
  };
}

function buildInitialState(runId: string, seed: number): PlayerState {
  return {
    runId,
    seed,
    currentMonth: 0,
    availableCash: 0,
    totalSavings: 0,
    grossIncome: TAX_CONFIG.grossSalary,
    netIncome: TAX_CONFIG.netSalary,
    recurringCommitments: [],
    debts: [],
    savingsBuckets: [
      {
        id: 'bucket-emergency',
        name: 'Emergency Fund',
        balance: 0,
        monthlyContribution: 0,
        isEmergencyFund: true,
      },
    ],
    transactions: [],
    decisionsCompleted: [],
    eventsExperienced: [],
    moneyMomentsSeen: [],
    monthlySpendByCategory: {},
    spendByCategory: {
      Housing: 0,
      Transport: 0,
      Groceries: 0,
      Entertainment: 0,
      Utilities: 0,
      Clothing: 0,
      FamilySupport: 0,
      Savings: 0,
      DebtRepayments: 0,
      Convenience: 0,
    },
    isEmployed: true,
    monthsWithSavings: 0,
    gamePhase: 'payslip',
  };
}

// ─── Mock Game Service Implementation ────────────────────────────────────────
// BACKEND INTEGRATION POINT: Replace each method body with a fetch() to the corresponding REST endpoint

export const mockGameService: GameService = {
  async getTaxConfiguration(): Promise<TaxConfiguration> {
    // BACKEND: GET /api/tax-configuration?year=2026-27
    return { ...TAX_CONFIG };
  },

  async createRun(seed?: number): Promise<PlayerState> {
    // BACKEND: POST /api/quests → POST /api/quests/{id}/start
    const runId = generateRunId();
    const resolvedSeed = seed ?? Date.now() % 100000;
    const state = buildInitialState(runId, resolvedSeed);
    runStore[runId] = state;
    return { ...state };
  },

  async getActiveRun(): Promise<PlayerState | null> {
    const runs = Object.values(runStore);
    return runs.length > 0 ? { ...runs[runs.length - 1] } : null;
  },

  async getPlayerState(runId: string): Promise<PlayerState> {
    // BACKEND: GET /api/runs/{id}
    const state = runStore[runId];
    if (!state) throw new Error(`Run ${runId} not found`);
    return { ...state };
  },

  async processMonth(
    runId: string,
    month: number
  ): Promise<{ events: LifeEvent[]; decisions: Decision[]; transactions: Transaction[] }> {
    // BACKEND: GET /api/runs/{id}/next-event
    const state = runStore[runId];
    if (!state) throw new Error(`Run ${runId} not found`);

    // Process payday
    const payslipTransactions: Transaction[] = [
      {
        id: generateTransactionId('gross', month, 0),
        type: 'SALARY_GROSS',
        amount: TAX_CONFIG.grossSalary,
        description: 'Gross salary',
        month,
        timestamp: new Date().toISOString(),
        runningBalance: state.availableCash + TAX_CONFIG.grossSalary,
      },
      {
        id: generateTransactionId('paye', month, 1),
        type: 'PAYE',
        amount: -TAX_CONFIG.paye,
        description: 'PAYE tax deduction',
        month,
        timestamp: new Date().toISOString(),
        runningBalance: state.availableCash + TAX_CONFIG.grossSalary - TAX_CONFIG.paye,
      },
      {
        id: generateTransactionId('uif', month, 2),
        type: 'UIF',
        amount: -TAX_CONFIG.uif,
        description: 'UIF contribution',
        month,
        timestamp: new Date().toISOString(),
        runningBalance: state.availableCash + TAX_CONFIG.netSalary,
      },
      {
        id: generateTransactionId('net', month, 3),
        type: 'SALARY_NET',
        amount: TAX_CONFIG.netSalary,
        description: 'Net salary received',
        month,
        timestamp: new Date().toISOString(),
        runningBalance: state.availableCash + TAX_CONFIG.netSalary,
      },
    ];

    let cashAfterPayday = state.availableCash + TAX_CONFIG.netSalary;

    // Process recurring commitments
    const commitmentTransactions: Transaction[] = [];
    for (const commitment of state.recurringCommitments) {
      if (!commitment.active) continue;
      if (commitment.startMonth > month) continue;
      if (commitment.endMonth && commitment.endMonth < month) continue;
      if (commitment.amount <= 0) continue;

      cashAfterPayday -= commitment.amount;
      commitmentTransactions.push({
        id: generateTransactionId(`commit-${commitment.id}`, month, commitmentTransactions.length),
        type: 'RENT',
        amount: -commitment.amount,
        description: commitment.name,
        month,
        timestamp: new Date().toISOString(),
        runningBalance: cashAfterPayday,
      });
    }

    // Process debt repayments
    for (const debt of state.debts) {
      if (!debt.active) continue;
      cashAfterPayday -= debt.monthlyRepayment;
      commitmentTransactions.push({
        id: generateTransactionId(`debt-${debt.id}`, month, commitmentTransactions.length),
        type: 'DEBT_REPAYMENT',
        amount: -debt.monthlyRepayment,
        description: `Repayment — ${debt.name}`,
        month,
        timestamp: new Date().toISOString(),
        runningBalance: cashAfterPayday,
      });
    }

    state.availableCash = cashAfterPayday;

    // Select eligible events for this month
    const eligibleEvents = LIFE_EVENTS.filter(e => {
      if (e.month !== month) return false;
      if (state.eventsExperienced.includes(e.id)) return false;
      const rand = seededRandom(state.seed, month * 100 + LIFE_EVENTS.indexOf(e));
      return rand < e.probability;
    });

    // Select eligible decisions
    const eligibleDecisions = Object.values(DECISIONS).filter(d => {
      if (d.month !== month) return false;
      if (state.decisionsCompleted.includes(d.id)) return false;
      return true;
    });

    const allTransactions = [...payslipTransactions, ...commitmentTransactions];
    state.transactions.push(...allTransactions);
    state.currentMonth = month;

    runStore[runId] = state;

    return {
      events: eligibleEvents,
      decisions: eligibleDecisions,
      transactions: allTransactions,
    };
  },

  async makeDecision(
    runId: string,
    decisionId: string,
    optionId: string
  ): Promise<{ newState: PlayerState; moneyMoment?: MoneyMoment }> {
    // BACKEND: POST /api/runs/{id}/decisions/{decisionId}
    const state = runStore[runId];
    if (!state) throw new Error(`Run ${runId} not found`);
    if (state.decisionsCompleted.includes(decisionId)) {
      throw new Error(`Decision ${decisionId} already completed (idempotency guard)`);
    }

    const decision = DECISIONS[decisionId];
    if (!decision) throw new Error(`Decision ${decisionId} not found`);

    const option = decision.options.find(o => o.id === optionId);
    if (!option) throw new Error(`Option ${optionId} not found`);

    // Apply upfront cost
    if (option.cost > 0) {
      state.availableCash -= option.cost;
      state.transactions.push({
        id: generateTransactionId(`decision-${optionId}`, state.currentMonth, state.transactions.length),
        type: 'PURCHASE',
        amount: -option.cost,
        description: `${option.label} — upfront`,
        month: state.currentMonth,
        timestamp: new Date().toISOString(),
        runningBalance: state.availableCash,
      });
    }

    // Add recurring commitment
    if (option.monthlyCommitment && option.commitmentName) {
      const isDebt = !!option.debtOffer;
      if (isDebt) {
        const debtId = `debt-${optionId}-${Date.now()}`;
        state.debts.push({
          id: debtId,
          name: option.commitmentName,
          provider: option.debtOffer!.provider,
          principal: option.cost + (option.monthlyCommitment * (option.debtOffer!.term - 1)),
          balance: option.monthlyCommitment * option.debtOffer!.term,
          monthlyRepayment: option.monthlyCommitment,
          interestRate: 0.18,
          startMonth: state.currentMonth,
          active: true,
        });
      } else {
        const commitmentId = `commit-${optionId}-${Date.now()}`;
        const isNegative = option.monthlyCommitment < 0;
        if (isNegative) {
          // Reduce existing housing commitment
          const housingCommit = state.recurringCommitments.find(c => c.category === 'Housing');
          if (housingCommit) housingCommit.amount += option.monthlyCommitment;
        } else {
          // Check if it's a savings commitment
          const isSavings = decision.category === 'Savings';
          state.recurringCommitments.push({
            id: commitmentId,
            name: option.commitmentName,
            amount: option.monthlyCommitment,
            category: isSavings ? 'Savings' : decision.category,
            startMonth: state.currentMonth,
            active: true,
          });
          if (isSavings) {
            const emergencyBucket = state.savingsBuckets.find(b => b.isEmergencyFund);
            if (emergencyBucket) {
              emergencyBucket.monthlyContribution = option.monthlyCommitment;
            }
          }
        }
      }
    }

    // Track housing/transport/phone choices
    if (decision.category === 'Housing') state.housingChoice = optionId;
    if (decision.category === 'Transport') state.transportChoice = optionId;
    if (decision.category === 'Smartphone') state.phoneChoice = optionId;

    // Update savings buckets monthly contribution
    const savingsCommitments = state.recurringCommitments.filter(c => c.category === 'Savings' && c.active);
    for (const sc of savingsCommitments) {
      const bucket = state.savingsBuckets.find(b => b.isEmergencyFund);
      if (bucket) {
        bucket.balance += sc.amount;
        bucket.monthlyContribution = sc.amount;
        state.totalSavings += sc.amount;
        state.monthsWithSavings += 1;
        state.availableCash -= sc.amount;
      }
    }

    state.decisionsCompleted.push(decisionId);

    // Update spendByCategory
    const cat = decision.category;
    if (!state.spendByCategory[cat]) state.spendByCategory[cat] = 0;
    state.spendByCategory[cat] += option.cost;

    // Trigger Money Moment check
    let moneyMoment: MoneyMoment | undefined;
    if (state.availableCash < 3000 && !state.moneyMomentsSeen.includes('mm-where-did-money-go')) {
      moneyMoment = MONEY_MOMENTS['mm-where-did-money-go'];
      state.moneyMomentsSeen.push('mm-where-did-money-go');
    } else if (
      decision.category === 'Housing' && !state.moneyMomentsSeen.includes('mm-real-cost-apartment')
    ) {
      moneyMoment = MONEY_MOMENTS['mm-real-cost-apartment'];
      state.moneyMomentsSeen.push('mm-real-cost-apartment');
    } else if (option.debtOffer && !state.moneyMomentsSeen.includes('mm-tomorrows-money')) {
      moneyMoment = MONEY_MOMENTS['mm-tomorrows-money'];
      state.moneyMomentsSeen.push('mm-tomorrows-money');
    } else if (
      decision.category === 'Savings' &&
      optionId !== 'opt-savings-none'&& !state.moneyMomentsSeen.includes('mm-small-habit')
    ) {
      moneyMoment = MONEY_MOMENTS['mm-small-habit'];
      state.moneyMomentsSeen.push('mm-small-habit');
    }

    runStore[runId] = state;

    return { newState: { ...state }, moneyMoment };
  },

  async getFinancialHealth(runId: string): Promise<FinancialHealthSnapshot> {
    // BACKEND: GET /api/runs/{id}/financial-health
    const state = runStore[runId];
    if (!state) throw new Error(`Run ${runId} not found`);
    return calculateFinancialHealth(state);
  },

  async getYearInMoney(runId: string): Promise<YearInMoneySummary> {
    // BACKEND: GET /api/runs/{id}/year-in-money
    const state = runStore[runId];
    if (!state) throw new Error(`Run ${runId} not found`);

    const totalGross = TAX_CONFIG.grossSalary * 12;
    const totalNet = TAX_CONFIG.netSalary * 12;
    const totalDebtRepaid = state.debts.reduce(
      (sum, d) => sum + d.monthlyRepayment * Math.min(state.currentMonth - d.startMonth + 1, state.currentMonth),
      0
    );
    const totalSaved = state.totalSavings;
    const totalSpent = totalNet - totalSaved - state.availableCash - totalDebtRepaid;

    const housingCommit = state.recurringCommitments.find(c => c.category === 'Housing');
    const transportCommit = state.recurringCommitments.find(c => c.category === 'Transport');
    const housingMonthly = housingCommit?.amount ?? 9500;
    const transportMonthly = transportCommit?.amount ?? 1800;

    return {
      totalGrossIncome: totalGross,
      totalNetIncome: totalNet,
      totalSpent,
      totalSaved,
      finalDebt: state.debts.reduce((sum, d) => sum + d.balance, 0),
      totalDebtRepaid,
      spendByCategory: { ...state.spendByCategory },
      annualisedSurprises: [
        {
          label: 'Rent',
          monthly: housingMonthly,
          annual: housingMonthly * 12,
          description: `Your apartment didn't cost R${housingMonthly.toLocaleString()}. It cost R${(housingMonthly * 12).toLocaleString()} across the year.`,
        },
        {
          label: 'Transport',
          monthly: transportMonthly,
          annual: transportMonthly * 12,
          description: `Getting around Johannesburg cost you R${(transportMonthly * 12).toLocaleString()} this year.`,
        },
        {
          label: 'Convenience & Entertainment',
          monthly: 2200,
          annual: 26400,
          description: 'Small outings, food deliveries, and social events added up to R26,400 across the year.',
        },
      ],
      keyDecisions: [
        {
          month: 1,
          title: 'Where you chose to live',
          choice: state.housingChoice?.includes('premium')
            ? 'Sandton Studio (R13,500/month)' : state.housingChoice?.includes('mid')
            ? 'Braamfontein 1-Bed (R9,500/month)' :'Roodepoort Flatlet (R6,500/month)',
          impact: `This single decision committed R${((housingMonthly) * 12).toLocaleString()} of your annual income before you bought a single meal.`,
        },
        {
          month: 2,
          title: 'The phone decision',
          choice: state.phoneChoice?.includes('premium')
            ? 'Galaxy S25 on 36-month contract' : state.phoneChoice?.includes('mid')
            ? 'Galaxy A55 on 24-month contract' :'Kept old phone / repaired screen',
          impact: state.phoneChoice?.includes('premium')
            ? 'R649/month × 36 months = R23,364 total cost.' :'Saved yourself a significant monthly commitment.',
        },
        {
          month: 5,
          title: 'Your savings habit',
          choice:
            state.monthsWithSavings > 4
              ? `Saved consistently — ${state.monthsWithSavings} months`
              : state.monthsWithSavings > 0
              ? `Saved irregularly — ${state.monthsWithSavings} months`
              : 'Did not establish a saving habit',
          impact:
            state.totalSavings > 5000
              ? `Built R${state.totalSavings.toLocaleString()} in emergency reserves.`
              : 'Left yourself exposed to unexpected expenses without a financial buffer.',
        },
        {
          month: 3,
          title: 'Transport choice',
          choice: state.transportChoice?.includes('car')
            ? 'Bought the Toyota Corolla' :'Stuck with Gautrain + Uber',
          impact: state.transportChoice?.includes('car')
            ? 'Added R4,700/month in fixed transport costs — R56,400/year.' :'Kept transport variable and manageable.',
        },
      ],
      monthlyBreakdown: Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        label: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
        grossIncome: TAX_CONFIG.grossSalary,
        netIncome: TAX_CONFIG.netSalary,
        totalCommitted: state.recurringCommitments.filter(c => c.active && c.startMonth <= i + 1).reduce((sum, c) => sum + c.amount, 0),
        totalDebtRepayments: state.debts.filter(d => d.active && d.startMonth <= i + 1).reduce((sum, d) => sum + d.monthlyRepayment, 0),
        totalSpent: TAX_CONFIG.netSalary * 0.7 + (i * 200),
        availableAtEnd: Math.max(1500, TAX_CONFIG.netSalary * 0.15 - (i * 150)),
        savings: state.monthsWithSavings > i ? (state.recurringCommitments.find(c => c.category === 'Savings')?.amount ?? 0) : 0,
        events: [],
        decisions: [],
      })),
    };
  },

  async getWhatIfForks(runId: string): Promise<WhatIfFork[]> {
    // BACKEND: GET /api/runs/{id}/what-if (list available forks)
    const state = runStore[runId];
    if (!state) throw new Error(`Run ${runId} not found`);

    const housingMonthly = state.recurringCommitments.find(c => c.category === 'Housing')?.amount ?? 9500;
    const phoneMonthly = state.debts.find(d => d.name.includes('Phone') || d.name.includes('Galaxy'))?.monthlyRepayment ?? 0;
    const savingsMonthly = state.recurringCommitments.find(c => c.category === 'Savings')?.amount ?? 0;

    const cheaperHousing = Math.max(6500, housingMonthly - 3000);
    const housingDiff = housingMonthly - cheaperHousing;

    return [
      {
        id: 'fork-apartment',
        title: 'What if you chose the cheaper apartment?',
        description: `Instead of paying R${housingMonthly.toLocaleString()}/month, you chose Roodepoort at R6,500/month.`,
        forkMonth: 1,
        originalChoice: `R${housingMonthly.toLocaleString()}/month apartment`,
        alternativeChoice: 'Roodepoort Flatlet — R6,500/month',
        originalOutcome: {
          finalCash: state.availableCash,
          finalSavings: state.totalSavings,
          finalDebt: state.debts.reduce((s, d) => s + d.balance, 0),
          totalSpent: TAX_CONFIG.netSalary * 12 - state.totalSavings - state.availableCash,
          monthlyAvailable: state.availableCash / Math.max(state.currentMonth, 1),
          debtFree: state.debts.length === 0,
          emergencyCoverage: (state.savingsBuckets.find(b => b.isEmergencyFund)?.balance ?? 0) / 8000,
        },
        alternativeOutcome: {
          finalCash: state.availableCash + housingDiff * 11,
          finalSavings: state.totalSavings + housingDiff * 6,
          finalDebt: Math.max(0, state.debts.reduce((s, d) => s + d.balance, 0) - housingDiff * 5),
          totalSpent: TAX_CONFIG.netSalary * 12 - state.totalSavings - state.availableCash - housingDiff * 11,
          monthlyAvailable: (state.availableCash + housingDiff * 11) / 11,
          debtFree: state.debts.reduce((s, d) => s + d.balance, 0) - housingDiff * 5 <= 0,
          emergencyCoverage: ((state.savingsBuckets.find(b => b.isEmergencyFund)?.balance ?? 0) + housingDiff * 6) / 8000,
        },
      },
      {
        id: 'fork-phone',
        title: 'What if you kept your old phone?',
        description: `Instead of a R${phoneMonthly}/month phone contract, you repaired your screen for R450 once.`,
        forkMonth: 2,
        originalChoice: phoneMonthly > 0 ? `Phone contract — R${phoneMonthly}/month` : 'Repaired screen (R450)',
        alternativeChoice: 'Screen repair — R450 once',
        originalOutcome: {
          finalCash: state.availableCash,
          finalSavings: state.totalSavings,
          finalDebt: state.debts.reduce((s, d) => s + d.balance, 0),
          totalSpent: TAX_CONFIG.netSalary * 12 - state.totalSavings - state.availableCash,
          monthlyAvailable: state.availableCash / Math.max(state.currentMonth, 1),
          debtFree: state.debts.length === 0,
          emergencyCoverage: (state.savingsBuckets.find(b => b.isEmergencyFund)?.balance ?? 0) / 8000,
        },
        alternativeOutcome: {
          finalCash: state.availableCash + phoneMonthly * 10,
          finalSavings: state.totalSavings + phoneMonthly * 5,
          finalDebt: Math.max(0, state.debts.reduce((s, d) => s + d.balance, 0) - phoneMonthly * 10),
          totalSpent: TAX_CONFIG.netSalary * 12 - state.totalSavings - state.availableCash - phoneMonthly * 10,
          monthlyAvailable: (state.availableCash + phoneMonthly * 10) / 10,
          debtFree: state.debts.reduce((s, d) => s + d.balance, 0) - phoneMonthly * 10 <= 0,
          emergencyCoverage: ((state.savingsBuckets.find(b => b.isEmergencyFund)?.balance ?? 0) + phoneMonthly * 5) / 8000,
        },
      },
      {
        id: 'fork-savings',
        title: 'What if you saved R1,000 every month?',
        description: 'Starting from Month 1, R1,000 automatically moved to your emergency fund every payday.',
        forkMonth: 1,
        originalChoice: savingsMonthly > 0 ? `Saved R${savingsMonthly}/month` : 'No regular savings',
        alternativeChoice: 'R1,000/month emergency savings from Month 1',
        originalOutcome: {
          finalCash: state.availableCash,
          finalSavings: state.totalSavings,
          finalDebt: state.debts.reduce((s, d) => s + d.balance, 0),
          totalSpent: TAX_CONFIG.netSalary * 12 - state.totalSavings - state.availableCash,
          monthlyAvailable: state.availableCash / Math.max(state.currentMonth, 1),
          debtFree: state.debts.length === 0,
          emergencyCoverage: (state.savingsBuckets.find(b => b.isEmergencyFund)?.balance ?? 0) / 8000,
        },
        alternativeOutcome: {
          finalCash: state.availableCash,
          finalSavings: 12000,
          finalDebt: Math.max(0, state.debts.reduce((s, d) => s + d.balance, 0) - 3000),
          totalSpent: TAX_CONFIG.netSalary * 12 - 12000 - state.availableCash,
          monthlyAvailable: state.availableCash / Math.max(state.currentMonth, 1),
          debtFree: state.debts.reduce((s, d) => s + d.balance, 0) - 3000 <= 0,
          emergencyCoverage: 12000 / 8000,
        },
      },
    ];
  },

  async simulateWhatIf(runId: string, forkId: string): Promise<WhatIfFork> {
    // BACKEND: POST /api/runs/{id}/what-if  { forkId }
    // This does NOT mutate the original run — it returns a computed fork only
    const forks = await mockGameService.getWhatIfForks(runId);
    const fork = forks.find(f => f.id === forkId);
    if (!fork) throw new Error(`Fork ${forkId} not found`);
    return fork;
  },

  async replayQuest(runId: string): Promise<PlayerState> {
    // BACKEND: POST /api/runs/{id}/replay
    const oldState = runStore[runId];
    if (!oldState) throw new Error(`Run ${runId} not found`);

    // New seed derived from old — creates a different but reproducible run
    const newSeed = (oldState.seed * 1103515245 + 12345) % 2147483648;
    const newRunId = generateRunId();
    const newState = buildInitialState(newRunId, newSeed);
    runStore[newRunId] = newState;

    return { ...newState };
  },
};

export default mockGameService;
