package com.moneyquest.api;

import com.moneyquest.api.dto.ApiDtos.CreateQuestRequest;
import com.moneyquest.api.dto.ApiDtos.PlayerStateResponse;
import com.moneyquest.api.dto.ApiDtos.QuestResponse;
import com.moneyquest.services.QuestService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/quests")
public class QuestController {
    private final QuestService service;

    public QuestController(QuestService service) { this.service = service; }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public QuestResponse create(@Valid @RequestBody(required = false) CreateQuestRequest request) {
        return service.create(request == null ? new CreateQuestRequest(null) : request);
    }

    @PostMapping("/{id}/start")
    public PlayerStateResponse start(@PathVariable String id) { return service.start(id); }
}
