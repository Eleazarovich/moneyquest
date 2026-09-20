package com.moneyquest.repositories;

import com.moneyquest.entities.RunEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RunRepository extends JpaRepository<RunEntity, String> {
    Optional<RunEntity> findByQuestId(String questId);
}
