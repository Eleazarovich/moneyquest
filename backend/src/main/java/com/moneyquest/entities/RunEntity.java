package com.moneyquest.entities;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "runs")
public class RunEntity {
    @Id
    private String id;

    @Column(name = "quest_id", nullable = false, unique = true, length = 36)
    private String questId;

    @Column(name = "owner_subject", nullable = false, length = 100)
    private String ownerSubject;

    @Column(nullable = false)
    private int seed;

    @Column(name = "current_month", nullable = false)
    private int currentMonth;

    @Column(name = "available_cash", nullable = false, precision = 14, scale = 2)
    private BigDecimal availableCash;

    @Column(name = "total_savings", nullable = false, precision = 14, scale = 2)
    private BigDecimal totalSavings;

    @Column(name = "gross_income", nullable = false, precision = 14, scale = 2)
    private BigDecimal grossIncome;

    @Column(name = "net_income", nullable = false, precision = 14, scale = 2)
    private BigDecimal netIncome;

    @Column(name = "is_employed", nullable = false)
    private boolean employed;

    @Column(name = "months_with_savings", nullable = false)
    private int monthsWithSavings;

    @Column(name = "game_phase", nullable = false, length = 30)
    private String gamePhase;

    @Column(name = "decisions_completed", nullable = false, columnDefinition = "TEXT")
    private String decisionsCompleted = "[]";

    @Column(name = "events_experienced", nullable = false, columnDefinition = "TEXT")
    private String eventsExperienced = "[]";

    @Column(name = "money_moments_seen", nullable = false, columnDefinition = "TEXT")
    private String moneyMomentsSeen = "[]";

    @Column(name = "category_spend", nullable = false, columnDefinition = "TEXT")
    private String categorySpend = "{}";

    @Column(name = "monthly_category_spend", nullable = false, columnDefinition = "TEXT")
    private String monthlyCategorySpend = "{}";

    @Column(name = "housing_choice", length = 100)
    private String housingChoice;

    @Column(name = "transport_choice", length = 100)
    private String transportChoice;

    @Column(name = "phone_choice", length = 100)
    private String phoneChoice;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @OneToMany(mappedBy = "run", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<RecurringCommitmentEntity> recurringCommitments = new ArrayList<>();

    @OneToMany(mappedBy = "run", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<DebtAccountEntity> debts = new ArrayList<>();

    @OneToMany(mappedBy = "run", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<SavingsBucketEntity> savingsBuckets = new ArrayList<>();

    @OneToMany(mappedBy = "run", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<TransactionEntity> transactions = new ArrayList<>();

    protected RunEntity() {
    }

    public RunEntity(String id, String questId, String ownerSubject, int seed,
                     BigDecimal grossIncome, BigDecimal netIncome, Instant now) {
        this.id = id;
        this.questId = questId;
        this.ownerSubject = ownerSubject;
        this.seed = seed;
        this.currentMonth = 0;
        this.availableCash = BigDecimal.ZERO;
        this.totalSavings = BigDecimal.ZERO;
        this.grossIncome = grossIncome;
        this.netIncome = netIncome;
        this.employed = true;
        this.monthsWithSavings = 0;
        this.gamePhase = "payslip";
        this.createdAt = now;
        this.updatedAt = now;
    }

    public void touch(Instant now) { this.updatedAt = now; }
    public void setCurrentMonth(int value) { this.currentMonth = value; }
    public void setAvailableCash(BigDecimal value) { this.availableCash = value; }
    public void setTotalSavings(BigDecimal value) { this.totalSavings = value; }
    public void setMonthsWithSavings(int value) { this.monthsWithSavings = value; }
    public void setGamePhase(String value) { this.gamePhase = value; }
    public void setDecisionsCompleted(String value) { this.decisionsCompleted = value; }
    public void setEventsExperienced(String value) { this.eventsExperienced = value; }
    public void setMoneyMomentsSeen(String value) { this.moneyMomentsSeen = value; }
    public void setCategorySpend(String value) { this.categorySpend = value; }
    public void setMonthlyCategorySpend(String value) { this.monthlyCategorySpend = value; }
    public void setHousingChoice(String value) { this.housingChoice = value; }
    public void setTransportChoice(String value) { this.transportChoice = value; }
    public void setPhoneChoice(String value) { this.phoneChoice = value; }

    public String getId() { return id; }
    public String getQuestId() { return questId; }
    public String getOwnerSubject() { return ownerSubject; }
    public int getSeed() { return seed; }
    public int getCurrentMonth() { return currentMonth; }
    public BigDecimal getAvailableCash() { return availableCash; }
    public BigDecimal getTotalSavings() { return totalSavings; }
    public BigDecimal getGrossIncome() { return grossIncome; }
    public BigDecimal getNetIncome() { return netIncome; }
    public boolean isEmployed() { return employed; }
    public int getMonthsWithSavings() { return monthsWithSavings; }
    public String getGamePhase() { return gamePhase; }
    public String getDecisionsCompleted() { return decisionsCompleted; }
    public String getEventsExperienced() { return eventsExperienced; }
    public String getMoneyMomentsSeen() { return moneyMomentsSeen; }
    public String getCategorySpend() { return categorySpend; }
    public String getMonthlyCategorySpend() { return monthlyCategorySpend; }
    public String getHousingChoice() { return housingChoice; }
    public String getTransportChoice() { return transportChoice; }
    public String getPhoneChoice() { return phoneChoice; }
    public List<RecurringCommitmentEntity> getRecurringCommitments() { return recurringCommitments; }
    public List<DebtAccountEntity> getDebts() { return debts; }
    public List<SavingsBucketEntity> getSavingsBuckets() { return savingsBuckets; }
    public List<TransactionEntity> getTransactions() { return transactions; }

    public void addCommitment(RecurringCommitmentEntity value) { recurringCommitments.add(value); value.setRun(this); }
    public void addDebt(DebtAccountEntity value) { debts.add(value); value.setRun(this); }
    public void addSavingsBucket(SavingsBucketEntity value) { savingsBuckets.add(value); value.setRun(this); }
    public void addTransaction(TransactionEntity value) { transactions.add(value); value.setRun(this); }
}
