package com.moneyquest.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.math.BigDecimal;

@Entity
@Table(name = "savings_buckets")
public class SavingsBucketEntity {
    @Id @Column(length = 36) private String id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "run_id", nullable = false) private RunEntity run;
    @Column(nullable = false) private String name;
    @Column(nullable = false, precision = 14, scale = 2) private BigDecimal balance;
    @Column(name = "monthly_contribution", nullable = false, precision = 14, scale = 2) private BigDecimal monthlyContribution;
    @Column(name = "is_emergency_fund", nullable = false) private boolean emergencyFund;

    protected SavingsBucketEntity() { }

    public SavingsBucketEntity(String id, String name, BigDecimal balance, BigDecimal monthlyContribution, boolean emergencyFund) {
        this.id = id; this.name = name; this.balance = balance; this.monthlyContribution = monthlyContribution; this.emergencyFund = emergencyFund;
    }

    public void setRun(RunEntity run) { this.run = run; }
    public void setBalance(BigDecimal value) { this.balance = value; }
    public void setMonthlyContribution(BigDecimal value) { this.monthlyContribution = value; }
    public String getId() { return id; }
    public String getName() { return name; }
    public BigDecimal getBalance() { return balance; }
    public BigDecimal getMonthlyContribution() { return monthlyContribution; }
    public boolean isEmergencyFund() { return emergencyFund; }
}
