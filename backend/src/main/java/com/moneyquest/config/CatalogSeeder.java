package com.moneyquest.config;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.moneyquest.content.GameCatalog;
import com.moneyquest.entities.DecisionEntity;
import com.moneyquest.entities.LifeEventEntity;
import com.moneyquest.repositories.DecisionRepository;
import com.moneyquest.repositories.LifeEventRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class CatalogSeeder implements ApplicationRunner {
    private final DecisionRepository decisionRepository;
    private final LifeEventRepository lifeEventRepository;
    private final ObjectMapper objectMapper;

    public CatalogSeeder(DecisionRepository decisionRepository, LifeEventRepository lifeEventRepository,
                         ObjectMapper objectMapper) {
        this.decisionRepository = decisionRepository;
        this.lifeEventRepository = lifeEventRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (decisionRepository.count() == 0) {
            decisionRepository.saveAll(GameCatalog.decisions().stream()
                .map(seed -> new DecisionEntity(seed.id(), seed.title(), seed.narrative(), seed.context(),
                    seed.month(), seed.category(), writeJson(seed.options())))
                .toList());
        }
        if (lifeEventRepository.count() == 0) {
            lifeEventRepository.saveAll(GameCatalog.events().stream()
                .map(seed -> new LifeEventEntity(seed.id(), seed.month(), seed.type(), seed.title(), seed.narrative(),
                    seed.emoji(), seed.cashEffect(), seed.transactionType(), seed.triggersDecision(),
                    seed.decisionId(), seed.probability()))
                .toList());
        }
    }

    private String writeJson(Object value) {
        try {
            return objectMapper.writeValueAsString(value);
        } catch (JsonProcessingException exception) {
            throw new IllegalStateException("Could not seed game catalog", exception);
        }
    }
}
