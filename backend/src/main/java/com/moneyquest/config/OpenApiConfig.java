package com.moneyquest.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "MoneyQuest Backend API",
        version = "0.1.0",
        description = "API for the MoneyQuest financial simulation."
    ),
    tags = {
        @Tag(name = "Authentication", description = "Player account authentication"),
        @Tag(name = "Configuration", description = "Game configuration"),
        @Tag(name = "Quests", description = "Quest creation and startup"),
        @Tag(name = "Runs", description = "Operations on an active game run")
    }
)
@SecurityScheme(
    name = "bearerAuth",
    type = SecuritySchemeType.HTTP,
    scheme = "bearer",
    bearerFormat = "JWT",
    in = SecuritySchemeIn.HEADER
)
public class OpenApiConfig {
}
