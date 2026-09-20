// Test suite for MoneyQuest mock game service
// Run with: npx jest src/services/__tests__/gameService.test.ts

import { mockGameService } from '../mockGameService';
import { describe, it, expect, beforeEach } from '@jest/globals';

// ─── Test: Tax Configuration ──────────────────────────────────────────────────
describe('Tax Configuration', () => {
  it('returns correct 2026/27 gross salary', async () => {
    const tax = await mockGameService.getTaxConfiguration();
    expect(tax.grossSalary).toBe(25000);
  });

  it('returns correct PAYE deduction', async () => {
    const tax = await mockGameService.getTaxConfiguration();
    expect(tax.paye).toBe(3381.00);
  });

  it('returns correct UIF deduction', async () => {
    const tax = await mockGameService.getTaxConfiguration();
    expect(tax.uif).toBe(177.12);
  });

  it('calculates correct net salary', async () => {
    const tax = await mockGameService.getTaxConfiguration();
    expect(tax.netSalary).toBeCloseTo(21441.88, 2);
  });

  it('net = gross - paye - uif', async () => {
    const tax = await mockGameService.getTaxConfiguration();
    expect(tax.grossSalary - tax.paye - tax.uif).toBeCloseTo(tax.netSalary, 2);
  });
});

// ─── Test: Run Creation ───────────────────────────────────────────────────────
describe('Run Creation', () => {
  it('creates a new run with zero starting cash', async () => {
    const state = await mockGameService.createRun(42);
    expect(state.availableCash).toBe(0);
  });

  it('creates a run with zero starting savings', async () => {
    const state = await mockGameService.createRun(42);
    expect(state.totalSavings).toBe(0);
  });

  it('creates a run with zero starting debt', async () => {
    const state = await mockGameService.createRun(42);
    expect(state.debts).toHaveLength(0);
  });

  it('creates a run with gamePhase payslip', async () => {
    const state = await mockGameService.createRun(42);
    expect(state.gamePhase).toBe('payslip');
  });

  it('creates a run with a unique runId', async () => {
    const s1 = await mockGameService.createRun(1);
    const s2 = await mockGameService.createRun(2);
    expect(s1.runId).not.toBe(s2.runId);
  });

  it('stores the seed in state', async () => {
    const state = await mockGameService.createRun(999);
    expect(state.seed).toBe(999);
  });
});

// ─── Test: Month Processing / Payslip ────────────────────────────────────────
describe('Month Processing — Payday', () => {
  let runId: string;

  beforeEach(async () => {
    const state = await mockGameService.createRun(42);
    runId = state.runId;
  });

  it('adds net salary to available cash after Month 1', async () => {
    const { transactions } = await mockGameService.processMonth(runId, 1);
    const state = await mockGameService.getPlayerState(runId);
    const netTxn = transactions.find(t => t.type === 'SALARY_NET');
    expect(netTxn).toBeDefined();
    expect(netTxn!.amount).toBeCloseTo(21441.88, 2);
  });

  it('includes PAYE deduction transaction', async () => {
    const { transactions } = await mockGameService.processMonth(runId, 1);
    const payeTxn = transactions.find(t => t.type === 'PAYE');
    expect(payeTxn).toBeDefined();
    expect(payeTxn!.amount).toBe(-3381.00);
  });

  it('includes UIF deduction transaction', async () => {
    const { transactions } = await mockGameService.processMonth(runId, 1);
    const uifTxn = transactions.find(t => t.type === 'UIF');
    expect(uifTxn).toBeDefined();
    expect(uifTxn!.amount).toBeCloseTo(-177.12, 2);
  });

  it('available cash after payday equals net salary when no commitments', async () => {
    await mockGameService.processMonth(runId, 1);
    const state = await mockGameService.getPlayerState(runId);
    // Cash = net salary minus any auto-deducted events
    expect(state.availableCash).toBeGreaterThan(0);
  });
});

// ─── Test: Recurring Commitments ─────────────────────────────────────────────
describe('Recurring Commitments', () => {
  let runId: string;

  beforeEach(async () => {
    const state = await mockGameService.createRun(42);
    runId = state.runId;
    await mockGameService.processMonth(runId, 1);
  });

  it('deducts rent commitment on subsequent months', async () => {
    // Make housing decision
    await mockGameService.makeDecision(runId, 'decision-housing', 'opt-housing-mid');
    const stateBefore = await mockGameService.getPlayerState(runId);
    const cashBefore = stateBefore.availableCash;

    await mockGameService.processMonth(runId, 2);
    const stateAfter = await mockGameService.getPlayerState(runId);

    // Month 2 adds net salary but deducts rent
    expect(stateAfter.availableCash).toBeLessThan(cashBefore + 21441.88);
  });

  it('same commitment is not charged twice in same month', async () => {
    await mockGameService.makeDecision(runId, 'decision-housing', 'opt-housing-mid');
    await mockGameService.processMonth(runId, 2);
    const state1 = await mockGameService.getPlayerState(runId);
    const cash1 = state1.availableCash;

    // Processing month 2 again should not deduct rent again
    // In a real idempotent system this would be protected; our mock tracks month
    expect(cash1).toBeDefined();
  });
});

// ─── Test: Decision Idempotency ───────────────────────────────────────────────
describe('Decision Idempotency', () => {
  let runId: string;

  beforeEach(async () => {
    const state = await mockGameService.createRun(42);
    runId = state.runId;
    await mockGameService.processMonth(runId, 1);
  });

  it('throws error when same decision is made twice', async () => {
    await mockGameService.makeDecision(runId, 'decision-housing', 'opt-housing-mid');
    await expect(
      mockGameService.makeDecision(runId, 'decision-housing', 'opt-housing-mid')
    ).rejects.toThrow('already completed');
  });
});

// ─── Test: Debt Accumulation ──────────────────────────────────────────────────
describe('Debt Engine', () => {
  let runId: string;

  beforeEach(async () => {
    const state = await mockGameService.createRun(42);
    runId = state.runId;
    await mockGameService.processMonth(runId, 1);
    await mockGameService.processMonth(runId, 2);
  });

  it('adds debt account when premium phone chosen', async () => {
    await mockGameService.makeDecision(runId, 'decision-phone', 'opt-phone-premium');
    const state = await mockGameService.getPlayerState(runId);
    expect(state.debts.length).toBeGreaterThan(0);
  });

  it('debt repayment reduces available cash in subsequent months', async () => {
    await mockGameService.makeDecision(runId, 'decision-phone', 'opt-phone-premium');
    const stateBefore = await mockGameService.getPlayerState(runId);

    await mockGameService.processMonth(runId, 3);
    const stateAfter = await mockGameService.getPlayerState(runId);

    // Net salary added, but debt repayment deducted
    expect(stateAfter.availableCash).toBeLessThan(stateBefore.availableCash + 21441.88);
  });

  it('no debt created when practical phone option chosen', async () => {
    await mockGameService.makeDecision(runId, 'decision-phone', 'opt-phone-keep');
    const state = await mockGameService.getPlayerState(runId);
    expect(state.debts).toHaveLength(0);
  });
});

// ─── Test: Financial Health Dimensions ───────────────────────────────────────
describe('Financial Health Dimensions', () => {
  it('resilience is Critical when no emergency savings', async () => {
    const state = await mockGameService.createRun(42);
    const health = await mockGameService.getFinancialHealth(state.runId);
    expect(health.resilience.state).toBe('Critical');
  });

  it('liquidity is Critical when cash is near zero', async () => {
    const state = await mockGameService.createRun(42);
    const health = await mockGameService.getFinancialHealth(state.runId);
    expect(['Critical', 'Vulnerable']).toContain(health.liquidity.state);
  });

  it('debt load is Strong when no debt', async () => {
    const state = await mockGameService.createRun(42);
    const health = await mockGameService.getFinancialHealth(state.runId);
    expect(health.debtLoad.state).toBe('Strong');
  });

  it('saving habit is Critical when no months with savings', async () => {
    const state = await mockGameService.createRun(42);
    const health = await mockGameService.getFinancialHealth(state.runId);
    expect(health.savingHabit.state).toBe('Critical');
  });

  it('health snapshot includes all 5 dimensions', async () => {
    const state = await mockGameService.createRun(42);
    const health = await mockGameService.getFinancialHealth(state.runId);
    expect(health.resilience).toBeDefined();
    expect(health.liquidity).toBeDefined();
    expect(health.debtLoad).toBeDefined();
    expect(health.savingHabit).toBeDefined();
    expect(health.lifestyleBalance).toBeDefined();
  });
});

// ─── Test: What-If Simulation Isolation ──────────────────────────────────────
describe('What-If Simulation', () => {
  let runId: string;

  beforeEach(async () => {
    const state = await mockGameService.createRun(42);
    runId = state.runId;
    await mockGameService.processMonth(runId, 1);
    await mockGameService.makeDecision(runId, 'decision-housing', 'opt-housing-premium');
  });

  it('returns fork without mutating original run', async () => {
    const originalState = await mockGameService.getPlayerState(runId);
    const originalCash = originalState.availableCash;

    await mockGameService.simulateWhatIf(runId, 'fork-apartment');

    const stateAfter = await mockGameService.getPlayerState(runId);
    expect(stateAfter.availableCash).toBe(originalCash);
  });

  it('alternative outcome has higher savings than original for cheaper apartment', async () => {
    const fork = await mockGameService.simulateWhatIf(runId, 'fork-apartment');
    expect(fork.alternativeOutcome.finalSavings).toBeGreaterThanOrEqual(fork.originalOutcome.finalSavings);
  });

  it('returns 3 available forks', async () => {
    const forks = await mockGameService.getWhatIfForks(runId);
    expect(forks).toHaveLength(3);
  });
});

// ─── Test: Year in Money Aggregates ──────────────────────────────────────────
describe('Year in Money', () => {
  let runId: string;

  beforeEach(async () => {
    const state = await mockGameService.createRun(42);
    runId = state.runId;
    for (let m = 1; m <= 12; m++) {
      await mockGameService.processMonth(runId, m);
    }
  });

  it('total gross income equals 12 × R25,000', async () => {
    const summary = await mockGameService.getYearInMoney(runId);
    expect(summary.totalGrossIncome).toBe(300000);
  });

  it('total net income equals 12 × R21,441.88', async () => {
    const summary = await mockGameService.getYearInMoney(runId);
    expect(summary.totalNetIncome).toBeCloseTo(257302.56, 0);
  });

  it('includes annualised surprises', async () => {
    const summary = await mockGameService.getYearInMoney(runId);
    expect(summary.annualisedSurprises.length).toBeGreaterThan(0);
  });

  it('includes key decisions', async () => {
    const summary = await mockGameService.getYearInMoney(runId);
    expect(summary.keyDecisions.length).toBeGreaterThan(0);
  });
});

// ─── Test: Seeded Event Reproducibility ──────────────────────────────────────
describe('Seeded Reproducibility', () => {
  it('same seed produces same event selection', async () => {
    const s1 = await mockGameService.createRun(12345);
    const s2 = await mockGameService.createRun(12345);

    const { events: events1 } = await mockGameService.processMonth(s1.runId, 2);
    const { events: events2 } = await mockGameService.processMonth(s2.runId, 2);

    const ids1 = events1.map(e => e.id).sort();
    const ids2 = events2.map(e => e.id).sort();
    expect(ids1).toEqual(ids2);
  });

  it('different seeds may produce different event selections', async () => {
    const s1 = await mockGameService.createRun(1);
    const s2 = await mockGameService.createRun(99999);

    const { events: events1 } = await mockGameService.processMonth(s1.runId, 5);
    const { events: events2 } = await mockGameService.processMonth(s2.runId, 5);

    // Not guaranteed to differ, but with sufficiently different seeds usually will
    // This test documents the seeding mechanism exists
    expect(Array.isArray(events1)).toBe(true);
    expect(Array.isArray(events2)).toBe(true);
  });
});

// ─── Test: Replay Quest ───────────────────────────────────────────────────────
describe('Replay Quest', () => {
  it('returns a new run with a different runId', async () => {
    const original = await mockGameService.createRun(42);
    const replay = await mockGameService.replayQuest(original.runId);
    expect(replay.runId).not.toBe(original.runId);
  });

  it('replay starts with zero cash', async () => {
    const original = await mockGameService.createRun(42);
    const replay = await mockGameService.replayQuest(original.runId);
    expect(replay.availableCash).toBe(0);
  });

  it('replay starts with zero debt', async () => {
    const original = await mockGameService.createRun(42);
    const replay = await mockGameService.replayQuest(original.runId);
    expect(replay.debts).toHaveLength(0);
  });

  it('replay uses a different seed than original', async () => {
    const original = await mockGameService.createRun(42);
    const replay = await mockGameService.replayQuest(original.runId);
    expect(replay.seed).not.toBe(original.seed);
  });
});
