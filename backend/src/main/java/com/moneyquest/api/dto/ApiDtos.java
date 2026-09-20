package com.moneyquest.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Map;

public final class ApiDtos {
    private ApiDtos() { }

    public record ErrorResponse(String message, String code) { }

    public record RegisterRequest(@NotBlank @Email String email, @NotBlank @Size(min = 8, max = 128) String password) { }
    public record LoginRequest(@NotBlank @Email String email, @NotBlank String password) { }
    public record UserResponse(String id, String email) { }
    public record AuthResponse(String accessToken, String tokenType, Instant expiresAt, UserResponse user) { }

    public record CreateQuestRequest(Integer seed) { }
    public record QuestResponse(String id, String accessToken) { }
    public record TaxConfigurationResponse(String taxYear, BigDecimal grossSalary, BigDecimal paye,
                                           BigDecimal uif, BigDecimal netSalary) { }

    public record TransactionResponse(String id, String type, BigDecimal amount, String description, int month,
                                      Instant timestamp, BigDecimal runningBalance) { }
    public record RecurringCommitmentResponse(String id, String name, BigDecimal amount, String category,
                                              int startMonth, Integer endMonth, boolean active) { }
    public record DebtAccountResponse(String id, String name, String provider, BigDecimal principal,
                                      BigDecimal balance, BigDecimal monthlyRepayment, BigDecimal interestRate,
                                      int startMonth, boolean active) { }
    public record SavingsBucketResponse(String id, String name, BigDecimal balance, BigDecimal monthlyContribution,
                                        boolean isEmergencyFund) { }
    public record DebtOfferResponse(String provider, BigDecimal depositRequired, BigDecimal monthlyRepayment, int term) { }
    public record DecisionOptionResponse(String id, String label, String description, BigDecimal cost,
                                         BigDecimal monthlyCommitment, String commitmentName, String emoji,
                                         String tag, String lifestyle, DebtOfferResponse debtOffer) { }
    public record DecisionResponse(String id, String title, String narrative, String context,
                                   List<DecisionOptionResponse> options, int month, String category) { }
    public record LifeEventResponse(String id, int month, String type, String title, String narrative, String emoji,
                                    BigDecimal cashEffect, String transactionType, Boolean triggersDecision,
                                    String decisionId, BigDecimal probability) { }

    public record PlayerStateResponse(String runId, int seed, int currentMonth, BigDecimal availableCash,
                                      BigDecimal totalSavings, BigDecimal grossIncome, BigDecimal netIncome,
                                      List<RecurringCommitmentResponse> recurringCommitments,
                                      List<DebtAccountResponse> debts, List<SavingsBucketResponse> savingsBuckets,
                                      List<TransactionResponse> transactions, List<String> decisionsCompleted,
                                      List<String> eventsExperienced, List<String> moneyMomentsSeen,
                                      String housingChoice, String transportChoice, String phoneChoice,
                                      Map<String, BigDecimal> monthlySpendByCategory,
                                      Map<String, BigDecimal> spendByCategory, boolean isEmployed,
                                      int monthsWithSavings, String gamePhase) { }

    public record ProcessMonthResponse(List<LifeEventResponse> events, List<DecisionResponse> decisions,
                                       List<TransactionResponse> transactions) { }
    public record MakeDecisionRequest(@NotBlank String optionId) { }
    public record MakeDecisionResponse(PlayerStateResponse newState, MoneyMomentResponse moneyMoment) { }
    public record SimulateWhatIfRequest(@NotBlank String forkId) { }

    public record MoneyMomentResponse(String id, String title, String narrative, String insight, String emoji,
                                      String triggerCondition, Map<String, BigDecimal> visualData) { }
    public record HealthDimensionResponse(String state, BigDecimal value, String explanation) { }
    public record FinancialHealthResponse(int month, HealthDimensionResponse resilience,
                                          HealthDimensionResponse liquidity, HealthDimensionResponse debtLoad,
                                          HealthDimensionResponse savingHabit, HealthDimensionResponse lifestyleBalance) { }

    public record MonthSummaryResponse(int month, String label, BigDecimal grossIncome, BigDecimal netIncome,
                                       BigDecimal totalCommitted, BigDecimal totalDebtRepayments, BigDecimal totalSpent,
                                       BigDecimal availableAtEnd, BigDecimal savings, List<String> events,
                                       List<String> decisions) { }
    public record AnnualisedSurpriseResponse(String label, BigDecimal monthly, BigDecimal annual, String description) { }
    public record KeyDecisionResponse(int month, String title, String choice, String impact) { }
    public record YearInMoneyResponse(BigDecimal totalGrossIncome, BigDecimal totalNetIncome, BigDecimal totalSpent,
                                      BigDecimal totalSaved, BigDecimal finalDebt, BigDecimal totalDebtRepaid,
                                      Map<String, BigDecimal> spendByCategory,
                                      List<AnnualisedSurpriseResponse> annualisedSurprises,
                                      List<KeyDecisionResponse> keyDecisions, List<MonthSummaryResponse> monthlyBreakdown) { }

    public record WhatIfOutcomeResponse(BigDecimal finalCash, BigDecimal finalSavings, BigDecimal finalDebt,
                                        BigDecimal totalSpent, BigDecimal monthlyAvailable, boolean debtFree,
                                        BigDecimal emergencyCoverage) { }
    public record WhatIfForkResponse(String id, String title, String description, int forkMonth,
                                      String originalChoice, String alternativeChoice,
                                      WhatIfOutcomeResponse originalOutcome, WhatIfOutcomeResponse alternativeOutcome) { }
}
