package com.moneyquest.api;

import com.moneyquest.api.dto.ApiDtos.TaxConfigurationResponse;
import com.moneyquest.services.TaxConfigurationService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tax-configuration")
public class ConfigurationController {
    private final TaxConfigurationService service;

    public ConfigurationController(TaxConfigurationService service) { this.service = service; }

    @GetMapping
    public TaxConfigurationResponse get(@RequestParam(required = false) String year) { return service.get(year); }
}
