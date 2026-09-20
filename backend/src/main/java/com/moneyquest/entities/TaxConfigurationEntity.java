package com.moneyquest.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;

@Entity
@Table(name = "tax_configurations")
public class TaxConfigurationEntity {
    @Id
    @Column(name = "tax_year", length = 20)
    private String taxYear;

    @Column(name = "gross_salary", nullable = false, precision = 12, scale = 2)
    private BigDecimal grossSalary;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal paye;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal uif;

    @Column(name = "net_salary", nullable = false, precision = 12, scale = 2)
    private BigDecimal netSalary;

    protected TaxConfigurationEntity() {
    }

    public String getTaxYear() { return taxYear; }
    public BigDecimal getGrossSalary() { return grossSalary; }
    public BigDecimal getPaye() { return paye; }
    public BigDecimal getUif() { return uif; }
    public BigDecimal getNetSalary() { return netSalary; }
}
