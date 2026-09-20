// Services layer entry point — swap mockGameService for realGameService when backend is ready
export { mockGameService as gameService } from './mockGameService';
export type {
  GameService,
  PlayerState,
  LifeEvent,
  Decision,
  DecisionOption,
  Transaction,
  MoneyMoment,
  FinancialHealthSnapshot,
  YearInMoneySummary,
  WhatIfFork,
  TaxConfiguration,
  RecurringCommitment,
  DebtAccount,
  SavingsBucket,
  HealthState,
  TransactionType,
} from './types';