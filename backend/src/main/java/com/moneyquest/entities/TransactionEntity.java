package com.moneyquest.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "transactions")
public class TransactionEntity {
    @Id private String id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "run_id", nullable = false) private RunEntity run;
    @Column(nullable = false, length = 40) private String type;
    @Column(nullable = false, precision = 14, scale = 2) private BigDecimal amount;
    @Column(nullable = false) private String description;
    @Column(nullable = false) private int month;
    @Column(name = "occurred_at", nullable = false) private Instant occurredAt;
    @Column(name = "running_balance", nullable = false, precision = 14, scale = 2) private BigDecimal runningBalance;

    protected TransactionEntity() { }

    public TransactionEntity(String id, String type, BigDecimal amount, String description, int month,
                             Instant occurredAt, BigDecimal runningBalance) {
        this.id = id; this.type = type; this.amount = amount; this.description = description;
        this.month = month; this.occurredAt = occurredAt; this.runningBalance = runningBalance;
    }

    public void setRun(RunEntity run) { this.run = run; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public void setRunningBalance(BigDecimal runningBalance) { this.runningBalance = runningBalance; }
    public String getId() { return id; }
    public String getType() { return type; }
    public BigDecimal getAmount() { return amount; }
    public String getDescription() { return description; }
    public int getMonth() { return month; }
    public Instant getOccurredAt() { return occurredAt; }
    public BigDecimal getRunningBalance() { return runningBalance; }
}
