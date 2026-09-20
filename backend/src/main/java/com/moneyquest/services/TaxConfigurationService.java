package com.moneyquest.services;

import com.moneyquest.api.GameMapper;
import com.moneyquest.api.dto.ApiDtos.TaxConfigurationResponse;
import com.moneyquest.entities.TaxConfigurationEntity;
import com.moneyquest.exceptions.ApiException;
import com.moneyquest.repositories.TaxConfigurationRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TaxConfigurationService {
    private final TaxConfigurationRepository repository;
    private final GameMapper mapper;

    public TaxConfigurationService(TaxConfigurationRepository repository, GameMapper mapper) {
        this.repository = repository; this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public TaxConfigurationResponse get(String year) {
        String requestedYear = year == null || year.isBlank() ? "2026-27" : year.trim();
        TaxConfigurationEntity configuration = repository.findById(requestedYear)
            .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "Tax configuration is not available for that year.", "UNKNOWN_TAX_YEAR"));
        return mapper.tax(configuration);
    }
}
