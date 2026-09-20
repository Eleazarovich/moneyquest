package com.moneyquest.api;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.moneyquest.api.dto.ApiDtos;
import com.moneyquest.entities.DecisionEntity;
import com.moneyquest.entities.DebtAccountEntity;
import com.moneyquest.entities.LifeEventEntity;
import com.moneyquest.entities.RecurringCommitmentEntity;
import com.moneyquest.entities.RunEntity;
import com.moneyquest.entities.SavingsBucketEntity;
import com.moneyquest.entities.TaxConfigurationEntity;
import com.moneyquest.entities.TransactionEntity;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Component
public class GameMapper {
    private static final TypeReference<List<String>> STRING_LIST = new TypeReference<>() { };
    private static final TypeReference<Map<String, BigDecimal>> DECIMAL_MAP = new TypeReference<>() { };
    private static final TypeReference<List<ApiDtos.DecisionOptionResponse>> OPTIONS = new TypeReference<>() { };
    private final ObjectMapper objectMapper;

    public GameMapper(ObjectMapper objectMapper) { this.objectMapper = objectMapper; }

    public ApiDtos.TaxConfigurationResponse tax(TaxConfigurationEntity value) {
        return new ApiDtos.TaxConfigurationResponse(value.getTaxYear(), value.getGrossSalary(), value.getPaye(), value.getUif(), value.getNetSalary());
    }

    public ApiDtos.PlayerStateResponse state(RunEntity run) {
        return new ApiDtos.PlayerStateResponse(run.getId(), run.getSeed(), run.getCurrentMonth(), run.getAvailableCash(),
            run.getTotalSavings(), run.getGrossIncome(), run.getNetIncome(),
            run.getRecurringCommitments().stream().map(this::commitment).toList(),
            run.getDebts().stream().map(this::debt).toList(),
            run.getSavingsBuckets().stream().map(this::savings).toList(),
            run.getTransactions().stream().map(this::transaction).toList(),
            readList(run.getDecisionsCompleted()), readList(run.getEventsExperienced()), readList(run.getMoneyMomentsSeen()),
            run.getHousingChoice(), run.getTransportChoice(), run.getPhoneChoice(),
            readMap(run.getMonthlyCategorySpend()), readMap(run.getCategorySpend()), run.isEmployed(),
            run.getMonthsWithSavings(), run.getGamePhase());
    }

    public ApiDtos.TransactionResponse transaction(TransactionEntity value) {
        return new ApiDtos.TransactionResponse(value.getId(), value.getType(), value.getAmount(), value.getDescription(),
            value.getMonth(), value.getOccurredAt(), value.getRunningBalance());
    }

    public ApiDtos.RecurringCommitmentResponse commitment(RecurringCommitmentEntity value) {
        return new ApiDtos.RecurringCommitmentResponse(value.getId(), value.getName(), value.getAmount(), value.getCategory(),
            value.getStartMonth(), value.getEndMonth(), value.isActive());
    }

    public ApiDtos.DebtAccountResponse debt(DebtAccountEntity value) {
        return new ApiDtos.DebtAccountResponse(value.getId(), value.getName(), value.getProvider(), value.getPrincipal(),
            value.getBalance(), value.getMonthlyRepayment(), value.getInterestRate(), value.getStartMonth(), value.isActive());
    }

    public ApiDtos.SavingsBucketResponse savings(SavingsBucketEntity value) {
        return new ApiDtos.SavingsBucketResponse(value.getId(), value.getName(), value.getBalance(), value.getMonthlyContribution(), value.isEmergencyFund());
    }

    public ApiDtos.DecisionResponse decision(DecisionEntity value) {
        return new ApiDtos.DecisionResponse(value.getId(), value.getTitle(), value.getNarrative(), value.getContext(),
            readOptions(value.getOptionsJson()), value.getMonth(), value.getCategory());
    }

    public ApiDtos.LifeEventResponse event(LifeEventEntity value) {
        return new ApiDtos.LifeEventResponse(value.getId(), value.getMonth(), value.getType(), value.getTitle(), value.getNarrative(),
            value.getEmoji(), value.getCashEffect(), value.getTransactionType(), value.isTriggersDecision(), value.getDecisionId(), value.getProbability());
    }

    public List<String> readList(String json) { return read(json, STRING_LIST, List.of()); }
    public Map<String, BigDecimal> readMap(String json) { return new LinkedHashMap<>(read(json, DECIMAL_MAP, Map.of())); }
    public List<ApiDtos.DecisionOptionResponse> readOptions(String json) { return read(json, OPTIONS, List.of()); }
    public String write(Object value) {
        try { return objectMapper.writeValueAsString(value); }
        catch (JsonProcessingException exception) { throw new IllegalStateException("Could not serialize game state", exception); }
    }

    private <T> T read(String json, TypeReference<T> type, T fallback) {
        try { return objectMapper.readValue(json, type); }
        catch (JsonProcessingException exception) { return fallback; }
    }
}
