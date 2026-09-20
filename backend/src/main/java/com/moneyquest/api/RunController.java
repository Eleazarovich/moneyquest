package com.moneyquest.api;

import com.moneyquest.api.dto.ApiDtos;
import com.moneyquest.security.AuthenticatedPrincipal;
import com.moneyquest.services.GameService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Validated
@RestController
@RequestMapping("/api/runs/{id}")
public class RunController {
    private final GameService service;

    public RunController(GameService service) { this.service = service; }

    @GetMapping
    public ApiDtos.PlayerStateResponse getState(@PathVariable String id, @AuthenticationPrincipal AuthenticatedPrincipal principal) {
        return service.getState(id, principal);
    }

    @GetMapping("/next-event")
    public ApiDtos.ProcessMonthResponse processMonth(@PathVariable String id,
                                                     @RequestParam @Min(1) @Max(12) int month,
                                                     @AuthenticationPrincipal AuthenticatedPrincipal principal) {
        return service.processMonth(id, month, principal);
    }

    @PostMapping("/decisions/{decisionId}")
    public ApiDtos.MakeDecisionResponse makeDecision(@PathVariable String id, @PathVariable String decisionId,
                                                     @Valid @RequestBody ApiDtos.MakeDecisionRequest request,
                                                     @AuthenticationPrincipal AuthenticatedPrincipal principal) {
        return service.makeDecision(id, decisionId, request, principal);
    }

    @GetMapping("/financial-health")
    public ApiDtos.FinancialHealthResponse financialHealth(@PathVariable String id,
                                                           @AuthenticationPrincipal AuthenticatedPrincipal principal) {
        return service.financialHealth(id, principal);
    }

    @GetMapping("/year-in-money")
    public ApiDtos.YearInMoneyResponse yearInMoney(@PathVariable String id,
                                                   @AuthenticationPrincipal AuthenticatedPrincipal principal) {
        return service.yearInMoney(id, principal);
    }

    @GetMapping("/what-if")
    public List<ApiDtos.WhatIfForkResponse> whatIfForks(@PathVariable String id,
                                                        @AuthenticationPrincipal AuthenticatedPrincipal principal) {
        return service.whatIfForks(id, principal);
    }

    @PostMapping("/what-if")
    public ApiDtos.WhatIfForkResponse simulateWhatIf(@PathVariable String id,
                                                     @Valid @RequestBody ApiDtos.SimulateWhatIfRequest request,
                                                     @AuthenticationPrincipal AuthenticatedPrincipal principal) {
        return service.simulateWhatIf(id, request, principal);
    }

    @PostMapping("/replay")
    public ApiDtos.PlayerStateResponse replay(@PathVariable String id,
                                              @AuthenticationPrincipal AuthenticatedPrincipal principal) {
        return service.replay(id, principal);
    }
}
