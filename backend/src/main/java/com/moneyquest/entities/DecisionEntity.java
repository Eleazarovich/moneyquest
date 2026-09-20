package com.moneyquest.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "decisions")
public class DecisionEntity {
    @Id private String id;
    @Column(nullable = false) private String title;
    @Column(nullable = false, columnDefinition = "TEXT") private String narrative;
    @Column(nullable = false, columnDefinition = "TEXT") private String context;
    @Column(nullable = false) private int month;
    @Column(nullable = false) private String category;
    @Column(name = "options_json", nullable = false, columnDefinition = "TEXT") private String optionsJson;

    protected DecisionEntity() { }

    public DecisionEntity(String id, String title, String narrative, String context, int month, String category, String optionsJson) {
        this.id = id; this.title = title; this.narrative = narrative; this.context = context;
        this.month = month; this.category = category; this.optionsJson = optionsJson;
    }

    public String getId() { return id; }
    public String getTitle() { return title; }
    public String getNarrative() { return narrative; }
    public String getContext() { return context; }
    public int getMonth() { return month; }
    public String getCategory() { return category; }
    public String getOptionsJson() { return optionsJson; }
}
