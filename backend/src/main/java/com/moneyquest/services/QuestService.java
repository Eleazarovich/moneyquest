package com.moneyquest.services;

import com.moneyquest.api.GameMapper;
import com.moneyquest.api.dto.ApiDtos.CreateQuestRequest;
import com.moneyquest.api.dto.ApiDtos.PlayerStateResponse;
import com.moneyquest.api.dto.ApiDtos.QuestResponse;
import com.moneyquest.entities.QuestEntity;
import com.moneyquest.entities.RunEntity;
import com.moneyquest.entities.SavingsBucketEntity;
import com.moneyquest.exceptions.ApiException;
import com.moneyquest.repositories.QuestRepository;
import com.moneyquest.repositories.RunRepository;
import com.moneyquest.repositories.TaxConfigurationRepository;
import com.moneyquest.security.JwtService;
import com.moneyquest.security.SecurityContextHelper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class QuestService {
    private final QuestRepository questRepository;
    private final RunRepository runRepository;
    private final TaxConfigurationRepository taxConfigurationRepository;
    private final JwtService jwtService;
    private final GameMapper mapper;

    public QuestService(QuestRepository questRepository, RunRepository runRepository,
                        TaxConfigurationRepository taxConfigurationRepository, JwtService jwtService, GameMapper mapper) {
        this.questRepository = questRepository; this.runRepository = runRepository;
        this.taxConfigurationRepository = taxConfigurationRepository; this.jwtService = jwtService; this.mapper = mapper;
    }

    @Transactional
    public QuestResponse create(CreateQuestRequest request) {
        String id = UUID.randomUUID().toString();
        String ownerSubject = SecurityContextHelper.currentPrincipal().map(principal -> principal.subject()).orElse("quest:" + id);
        int seed = request.seed() == null ? ThreadLocalRandom.current().nextInt(1, Integer.MAX_VALUE) : request.seed();
        QuestEntity quest = new QuestEntity(id, ownerSubject, seed, Instant.now());
        questRepository.save(quest);
        String accessToken = ownerSubject.startsWith("quest:") ? jwtService.issue(ownerSubject, "quest").value() : null;
        return new QuestResponse(id, accessToken);
    }

    @Transactional
    public PlayerStateResponse start(String questId) {
        QuestEntity quest = questRepository.findById(questId).orElseThrow(() -> notFound("Quest", "QUEST_NOT_FOUND"));
        RunEntity run = runRepository.findByQuestId(questId).orElse(null);
        if (run == null) {
            var tax = taxConfigurationRepository.findById("2026-27")
                .orElseThrow(() -> new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Default tax configuration is missing.", "MISSING_TAX_CONFIGURATION"));
            Instant now = Instant.now();
            run = new RunEntity(UUID.randomUUID().toString(), questId, quest.getOwnerSubject(), quest.getSeed(),
                tax.getGrossSalary(), tax.getNetSalary(), now);
            run.addSavingsBucket(new SavingsBucketEntity(UUID.randomUUID().toString(), "Emergency Fund", BigDecimal.ZERO, BigDecimal.ZERO, true));
            quest.markStarted();
            questRepository.save(quest);
            runRepository.save(run);
        }
        return mapper.state(run);
    }

    @Transactional(readOnly = true)
    public RunEntity getOwnedRun(String runId, String subject) {
        RunEntity run = runRepository.findById(runId).orElseThrow(() -> notFound("Run", "RUN_NOT_FOUND"));
        if (!run.getOwnerSubject().equals(subject)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "The authenticated caller cannot access this run.", "RUN_FORBIDDEN");
        }
        return run;
    }

    private ApiException notFound(String resource, String code) {
        return new ApiException(HttpStatus.NOT_FOUND, resource + " was not found.", code);
    }
}
