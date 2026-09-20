package com.moneyquest.persistence;

import com.moneyquest.entities.UserEntity;
import com.moneyquest.repositories.DecisionRepository;
import com.moneyquest.repositories.LifeEventRepository;
import com.moneyquest.repositories.TaxConfigurationRepository;
import com.moneyquest.repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.Instant;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("prod")
@Testcontainers(disabledWithoutDocker = true)
class PostgresPersistenceIntegrationTest {
    @Container
    static final PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine")
        .withDatabaseName("moneyquest")
        .withUsername("moneyquest")
        .withPassword("moneyquest");

    @DynamicPropertySource
    static void databaseProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("spring.datasource.driver-class-name", () -> "org.postgresql.Driver");
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "validate");
        registry.add("spring.jpa.properties.hibernate.dialect", () -> "org.hibernate.dialect.PostgreSQLDialect");
    }

    @Autowired TaxConfigurationRepository taxConfigurations;
    @Autowired DecisionRepository decisions;
    @Autowired LifeEventRepository lifeEvents;
    @Autowired UserRepository users;
    @Autowired PasswordEncoder passwordEncoder;

    @Test
    void flywaySeedAndJpaPersistenceWorkAgainstPostgres() {
        assertThat(taxConfigurations.findById("2026-27")).isPresent();
        assertThat(decisions.count()).isEqualTo(7);
        assertThat(lifeEvents.count()).isEqualTo(8);

        String email = "postgres-" + UUID.randomUUID() + "@example.com";
        UserEntity saved = users.save(new UserEntity(UUID.randomUUID().toString(), email,
            passwordEncoder.encode("correct-horse-battery"), Instant.now()));

        assertThat(users.findById(saved.getId())).get().satisfies(user -> {
            assertThat(user.getEmail()).isEqualTo(email);
            assertThat(user.getPasswordHash()).isNotEqualTo("correct-horse-battery");
            assertThat(passwordEncoder.matches("correct-horse-battery", user.getPasswordHash())).isTrue();
        });
    }
}
