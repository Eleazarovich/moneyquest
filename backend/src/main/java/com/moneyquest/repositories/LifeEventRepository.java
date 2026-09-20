package com.moneyquest.repositories;

import com.moneyquest.entities.LifeEventEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LifeEventRepository extends JpaRepository<LifeEventEntity, String> {
    List<LifeEventEntity> findByMonthOrderById(int month);
}
