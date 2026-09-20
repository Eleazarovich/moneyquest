package com.moneyquest.repositories;

import com.moneyquest.entities.TaxConfigurationEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaxConfigurationRepository extends JpaRepository<TaxConfigurationEntity, String> {
}
