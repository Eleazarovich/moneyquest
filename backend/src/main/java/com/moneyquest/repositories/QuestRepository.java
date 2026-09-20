package com.moneyquest.repositories;

import com.moneyquest.entities.QuestEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestRepository extends JpaRepository<QuestEntity, String> {
}
