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
@Table(name = "recurring_commitments")
public class RecurringCommitmentEntity {
    @Id
    private String id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "run_id", nullable = false)
    private RunEntity run;
    @Column(nullable = false) private String name;
    @Column(nullable = false, precision = 14, scale = 2) private BigDecimal amount;
    @Column(nullable = false) private String category;
    @Column(name = "start_month", nullable = false) private int startMonth;
    @Column(name = "end_month") private Integer endMonth;
    @Column(nullable = false) private boolean active;

    protected RecurringCommitmentEntity() { }

    public RecurringCommitmentEntity(String id, String name, BigDecimal amount, String category,
                                     int startMonth, Integer endMonth, boolean active) {
        this.id = id; this.name = name; this.amount = amount; this.category = category;
        this.startMonth = startMonth; this.endMonth = endMonth; this.active = active;
    }

    public void setRun(RunEntity run) { this.run = run; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public String getId() { return id; }
    public String getName() { return name; }
    public BigDecimal getAmount() { return amount; }
    public String getCategory() { return category; }
    public int getStartMonth() { return startMonth; }
    public Integer getEndMonth() { return endMonth; }
    public boolean isActive() { return active; }
}
