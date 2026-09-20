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
@Table(name = "debt_accounts")
public class DebtAccountEntity {
    @Id @Column(length = 36) private String id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "run_id", nullable = false) private RunEntity run;
    @Column(nullable = false) private String name;
    @Column(nullable = false) private String provider;
    @Column(nullable = false, precision = 14, scale = 2) private BigDecimal principal;
    @Column(nullable = false, precision = 14, scale = 2) private BigDecimal balance;
    @Column(name = "monthly_repayment", nullable = false, precision = 14, scale = 2) private BigDecimal monthlyRepayment;
    @Column(name = "interest_rate", nullable = false, precision = 8, scale = 5) private BigDecimal interestRate;
    @Column(name = "start_month", nullable = false) private int startMonth;
    @Column(nullable = false) private boolean active;

    protected DebtAccountEntity() { }

    public DebtAccountEntity(String id, String name, String provider, BigDecimal principal, BigDecimal balance,
                             BigDecimal monthlyRepayment, BigDecimal interestRate, int startMonth, boolean active) {
        this.id = id; this.name = name; this.provider = provider; this.principal = principal;
        this.balance = balance; this.monthlyRepayment = monthlyRepayment; this.interestRate = interestRate;
        this.startMonth = startMonth; this.active = active;
    }

    public void setRun(RunEntity run) { this.run = run; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }
    public void setActive(boolean active) { this.active = active; }
    public String getId() { return id; }
    public String getName() { return name; }
    public String getProvider() { return provider; }
    public BigDecimal getPrincipal() { return principal; }
    public BigDecimal getBalance() { return balance; }
    public BigDecimal getMonthlyRepayment() { return monthlyRepayment; }
    public BigDecimal getInterestRate() { return interestRate; }
    public int getStartMonth() { return startMonth; }
    public boolean isActive() { return active; }
}
