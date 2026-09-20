package com.moneyquest.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;

@Entity
@Table(name = "life_events")
public class LifeEventEntity {
    @Id @Column(length = 100) private String id;
    @Column(nullable = false) private int month;
    @Column(name = "event_type", nullable = false, length = 30) private String type;
    @Column(nullable = false) private String title;
    @Column(nullable = false, columnDefinition = "TEXT") private String narrative;
    @Column(nullable = false, length = 20) private String emoji;
    @Column(name = "cash_effect", precision = 14, scale = 2) private BigDecimal cashEffect;
    @Column(name = "transaction_type", length = 40) private String transactionType;
    @Column(name = "triggers_decision", nullable = false) private boolean triggersDecision;
    @Column(name = "decision_id", length = 100) private String decisionId;
    @Column(nullable = false, precision = 5, scale = 4) private BigDecimal probability;

    protected LifeEventEntity() { }

    public LifeEventEntity(String id, int month, String type, String title, String narrative, String emoji,
                           BigDecimal cashEffect, String transactionType, boolean triggersDecision, String decisionId,
                           BigDecimal probability) {
        this.id = id; this.month = month; this.type = type; this.title = title; this.narrative = narrative;
        this.emoji = emoji; this.cashEffect = cashEffect; this.transactionType = transactionType;
        this.triggersDecision = triggersDecision; this.decisionId = decisionId; this.probability = probability;
    }

    public String getId() { return id; }
    public int getMonth() { return month; }
    public String getType() { return type; }
    public String getTitle() { return title; }
    public String getNarrative() { return narrative; }
    public String getEmoji() { return emoji; }
    public BigDecimal getCashEffect() { return cashEffect; }
    public String getTransactionType() { return transactionType; }
    public boolean isTriggersDecision() { return triggersDecision; }
    public String getDecisionId() { return decisionId; }
    public BigDecimal getProbability() { return probability; }
}
