// Core domain types for MoneyQuest simulation

export type HealthState = 'Strong' | 'Healthy' | 'Stable' | 'Building' | 'Vulnerable' | 'Critical';

export type TransactionType =
  | 'SALARY_GROSS' |'PAYE' |'UIF' |'SALARY_NET' |'RENT' |'UTILITIES' |'TRANSPORT' |'GROCERIES' |'ENTERTAINMENT' |'FAMILY_SUPPORT' |'PURCHASE' |'DEBT_DISBURSEMENT' |'DEBT_REPAYMENT' |'SAVINGS_TRANSFER' |'EMERGENCY_EXPENSE' |'SIDE_INCOME' |'BONUS' |'REFUND';

export interface TaxConfiguration {
  taxYear: string;
  grossSalary: number;
  paye: number;
  uif: number;
  netSalary: number;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  month: number;
  timestamp: string;
  runningBalance: number;
}

export interface RecurringCommitment {
  id: string;
  name: string;
  amount: number;
  category: string;
  startMonth: number;
  endMonth?: number;
  active: boolean;
}

export interface DebtAccount {
  id: string;
  name: string;
  provider: string;
  principal: number;
  balance: number;
  monthlyRepayment: number;
  interestRate: number;
  startMonth: number;
  active: boolean;
}

export interface SavingsBucket {
  id: string;
  name: string;
  balance: number;
  monthlyContribution: number;
  isEmergencyFund: boolean;
}

export interface FinancialHealthSnapshot {
  month: number;
  resilience: { state: HealthState; value: number; explanation: string };
  liquidity: { state: HealthState; value: number; explanation: string };
  debtLoad: { state: HealthState; value: number; explanation: string };
  savingHabit: { state: HealthState; value: number; explanation: string };
  lifestyleBalance: { state: HealthState; value: number; explanation: string };
}

export interface DecisionOption {
  id: string;
  label: string;
  description: string;
  cost: number;
  monthlyCommitment?: number;
  commitmentName?: string;
  emoji: string;
  tag?: string;
  lifestyle?: string;
  debtOffer?: {
    provider: string;
    depositRequired: number;
    monthlyRepayment: number;
    term: number;
  };
}

export interface Decision {
  id: string;
  title: string;
  narrative: string;
  context: string;
  options: DecisionOption[];
  month: number;
  category: string;
}

export interface LifeEvent {
  id: string;
  month: number;
  type: 'social' | 'family' | 'career' | 'unexpected' | 'relationship' | 'income_shock';
  title: string;
  narrative: string;
  emoji: string;
  cashEffect?: number;
  transactionType?: TransactionType;
  triggersDecision?: boolean;
  decisionId?: string;
  probability: number;
}

export interface MoneyMoment {
  id: string;
  title: string;
  narrative: string;
  insight: string;
  emoji: string;
  triggerCondition: string;
  visualData?: Record<string, number>;
}

export interface PlayerState {
  runId: string;
  seed: number;
  currentMonth: number;
  availableCash: number;
  totalSavings: number;
  grossIncome: number;
  netIncome: number;
  recurringCommitments: RecurringCommitment[];
  debts: DebtAccount[];
  savingsBuckets: SavingsBucket[];
  transactions: Transaction[];
  decisionsCompleted: string[];
  eventsExperienced: string[];
  moneyMomentsSeen: string[];
  housingChoice?: string;
  transportChoice?: string;
  phoneChoice?: string;
  monthlySpendByCategory: Record<string, number>;
  spendByCategory: Record<string, number>;
  isEmployed: boolean;
  monthsWithSavings: number;
  gamePhase: 'landing' | 'payslip' | 'playing' | 'health_check' | 'year_in_money' | 'what_if' | 'replay';
}

export interface MonthSummary {
  month: number;
  label: string;
  grossIncome: number;
  netIncome: number;
  totalCommitted: number;
  totalDebtRepayments: number;
  totalSpent: number;
  availableAtEnd: number;
  savings: number;
  events: string[];
  decisions: string[];
}

export interface YearInMoneySummary {
  totalGrossIncome: number;
  totalNetIncome: number;
  totalSpent: number;
  totalSaved: number;
  finalDebt: number;
  totalDebtRepaid: number;
  spendByCategory: Record<string, number>;
  annualisedSurprises: Array<{ label: string; monthly: number; annual: number; description: string }>;
  keyDecisions: Array<{ month: number; title: string; choice: string; impact: string }>;
  monthlyBreakdown: MonthSummary[];
}

export interface WhatIfFork {
  id: string;
  title: string;
  description: string;
  forkMonth: number;
  originalChoice: string;
  alternativeChoice: string;
  originalOutcome: WhatIfOutcome;
  alternativeOutcome: WhatIfOutcome;
}

export interface WhatIfOutcome {
  finalCash: number;
  finalSavings: number;
  finalDebt: number;
  totalSpent: number;
  monthlyAvailable: number;
  debtFree: boolean;
  emergencyCoverage: number;
}

export interface GameService {
  createRun(seed?: number): Promise<PlayerState>;
  getPlayerState(runId: string): Promise<PlayerState>;
  processMonth(runId: string, month: number): Promise<{ events: LifeEvent[]; decisions: Decision[]; transactions: Transaction[] }>;
  makeDecision(runId: string, decisionId: string, optionId: string): Promise<{ newState: PlayerState; moneyMoment?: MoneyMoment }>;
  getFinancialHealth(runId: string): Promise<FinancialHealthSnapshot>;
  getYearInMoney(runId: string): Promise<YearInMoneySummary>;
  getWhatIfForks(runId: string): Promise<WhatIfFork[]>;
  simulateWhatIf(runId: string, forkId: string): Promise<WhatIfFork>;
  replayQuest(runId: string): Promise<PlayerState>;
  getTaxConfiguration(): TaxConfiguration;
}