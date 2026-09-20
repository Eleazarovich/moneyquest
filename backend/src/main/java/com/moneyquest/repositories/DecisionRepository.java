package com.moneyquest.repositories;

import com.moneyquest.entities.DecisionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DecisionRepository extends JpaRepository<DecisionEntity, String> {
    List<DecisionEntity> findByMonthOrderById(int month);
}
