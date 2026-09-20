package com.moneyquest.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;

@Entity
@Table(name = "quests")
public class QuestEntity {
    @Id
    private String id;

    @Column(name = "owner_subject", nullable = false, length = 100)
    private String ownerSubject;

    @Column(nullable = false)
    private int seed;

    @Column(nullable = false)
    private boolean started;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    protected QuestEntity() {
    }

    public QuestEntity(String id, String ownerSubject, int seed, Instant createdAt) {
        this.id = id;
        this.ownerSubject = ownerSubject;
        this.seed = seed;
        this.createdAt = createdAt;
    }

    public String getId() { return id; }
    public String getOwnerSubject() { return ownerSubject; }
    public int getSeed() { return seed; }
    public boolean isStarted() { return started; }
    public void markStarted() { this.started = true; }
}
