'use client';
import React, { useState } from 'react';
import type { Transaction, RecurringCommitment, DebtAccount } from '@/services/types';

interface TransactionFeedProps {
  transactions: Transaction[];
  recurringCommitments: RecurringCommitment[];
  debts: DebtAccount[];
  totalSavings: number;
}

const TYPE_EMOJI: Record<string, string> = {
  SALARY_GROSS: '💰',
  PAYE: '🏛️',
  UIF: '🏛️',
  SALARY_NET: '✅',
  RENT: '🏠',
  UTILITIES: '⚡',
  TRANSPORT: '🚇',
  GROCERIES: '🛒',
  ENTERTAINMENT: '🎭',
  FAMILY_SUPPORT: '👨‍👩‍👧',
  PURCHASE: '🛍️',
  DEBT_DISBURSEMENT: '💳',
  DEBT_REPAYMENT: '💸',
  SAVINGS_TRANSFER: '🛡️',
  EMERGENCY_EXPENSE: '🚨',
  SIDE_INCOME: '💼',
  BONUS: '🎉',
  REFUND: '↩️',
};

export default function TransactionFeed({ transactions, recurringCommitments, debts, totalSavings }: TransactionFeedProps) {
  const [tab, setTab] = useState<'transactions' | 'commitments'>('transactions');

  const recentTransactions = [...transactions].reverse().slice(0, 20);

  return (
    <div className="card-surface rounded-2xl overflow-hidden sticky top-20">
      <div className="px-4 py-3 border-b border-border">
        <div className="flex gap-1">
          {[
            { key: 'transactions', label: 'Transactions' },
            { key: 'commitments', label: 'Commitments' },
          ].map(t => (
            <button
              key={`tab-${t.key}`}
              onClick={() => setTab(t.key as typeof tab)}
              className={`flex-1 py-1.5 text-xs font-600 rounded-lg transition-all ${
                tab === t.key
                  ? 'bg-primary/15 text-primary' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-hide">
        {tab === 'transactions' ? (
          <div>
            {recentTransactions.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">
                No transactions yet. Start Month 1 to see your payslip.
              </div>
            ) : (
              recentTransactions.map(txn => (
                <div key={`txn-${txn.id}`} className="transaction-row flex items-center gap-3 px-4 py-3 border-b border-border/50 last:border-0">
                  <div className="text-lg flex-shrink-0">{TYPE_EMOJI[txn.type] ?? '•'}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-500 text-foreground truncate">{txn.description}</div>
                    <div className="text-xs text-muted-foreground">Month {txn.month}</div>
                  </div>
                  <div className={`font-mono text-xs font-600 flex-shrink-0 ${txn.amount > 0 ? 'text-positive' : 'text-negative'}`}>
                    {txn.amount > 0 ? '+' : ''}R{Math.abs(txn.amount).toLocaleString('en-ZA', { minimumFractionDigits: 0 })}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {recurringCommitments.length === 0 && debts.length === 0 ? (
              <div className="text-center text-sm text-muted-foreground py-4">
                No recurring commitments yet. Make decisions to see commitments here.
              </div>
            ) : (
              <>
                {recurringCommitments.map(c => (
                  <div key={`commit-${c.id}`} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                    <div>
                      <div className="text-xs font-500 text-foreground">{c.name}</div>
                      <div className="text-xs text-muted-foreground">{c.category} · monthly</div>
                    </div>
                    <div className="font-mono text-xs font-600 text-warning">
                      R{c.amount.toLocaleString('en-ZA', { minimumFractionDigits: 0 })}/mo
                    </div>
                  </div>
                ))}
                {debts.map(d => (
                  <div key={`debt-${d.id}`} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                    <div>
                      <div className="text-xs font-500 text-foreground">{d.name}</div>
                      <div className="text-xs text-muted-foreground">{d.provider} · debt</div>
                    </div>
                    <div className="font-mono text-xs font-600 text-negative">
                      R{d.monthlyRepayment.toLocaleString('en-ZA', { minimumFractionDigits: 0 })}/mo
                    </div>
                  </div>
                ))}
                {totalSavings > 0 && (
                  <div className="flex justify-between items-center py-2">
                    <div>
                      <div className="text-xs font-500 text-foreground">Emergency Fund</div>
                      <div className="text-xs text-muted-foreground">Savings · growing</div>
                    </div>
                    <div className="font-mono text-xs font-600 text-positive">
                      R{totalSavings.toLocaleString('en-ZA', { minimumFractionDigits: 0 })} total
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}