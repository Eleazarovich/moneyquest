package com.moneyquest.api;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.MethodOrderer.OrderAnnotation;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.fail;

/**
 * Black-box HTTP tests for the production-profile stack in the repository-root
 * docker-compose.yaml. They are opt-in because ordinary Maven tests should not
 * require a Docker daemon or rebuild the application image.
 */
@EnabledIfEnvironmentVariable(named = "RUN_DOCKER_COMPOSE_TESTS", matches = "true")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(OrderAnnotation.class)
class DockerComposeApiIntegrationTest {
    private static final ObjectMapper JSON = new ObjectMapper();
    private static final Duration HTTP_TIMEOUT = Duration.ofSeconds(20);
    private static final Duration COMPOSE_TIMEOUT = Duration.ofMinutes(5);
    private static final Path REPOSITORY_ROOT = findRepositoryRoot();
    private static final String BASE_URL = trimTrailingSlash(
        System.getenv().getOrDefault("MONEYQUEST_TEST_BASE_URL", "http://localhost:8080"));

    private final HttpClient http = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(5)).build();
    private final String composeProject = "moneyquest-it-" + UUID.randomUUID().toString().substring(0, 8);
    private final String postgresVolume = composeProject + "-pgdata";

    @BeforeAll
    void startComposeStack() throws Exception {
        runCompose("up", "--build", "--detach");
        waitForApplication();
    }

    @AfterAll
    void stopComposeStack() {
        try {
            runCompose("down", "--volumes", "--remove-orphans");
        } catch (Exception exception) {
            System.err.println("Could not clean up Docker Compose test stack: " + exception.getMessage());
        }
    }

    @Test
    @Order(1)
    void composeApplicationPublishesOpenApiAndSeededTaxConfiguration() throws Exception {
        Response apiDocs = request("GET", "/v3/api-docs", null, null);
        assertStatus(apiDocs, 200);
        assertThat(apiDocs.json().path("info").path("title").asText()).isEqualTo("MoneyQuest Backend API");
        assertThat(apiDocs.json().path("paths").has("/api/runs/{id}/what-if")).isTrue();

        Response tax = request("GET", "/api/tax-configuration", null, null);
        assertStatus(tax, 200);
        assertThat(tax.json().path("taxYear").asText()).isEqualTo("2026-27");
        assertThat(tax.json().path("grossSalary").decimalValue()).isEqualByComparingTo("25000.00");
        assertThat(tax.json().path("netSalary").decimalValue()).isEqualByComparingTo("21441.88");

        assertError(request("GET", "/api/tax-configuration?year=1900-01", null, null), 400, "UNKNOWN_TAX_YEAR");
    }

    @Test
    @Order(2)
    void publicCorsAndAnonymousBootstrapCreateAProtectedRun() throws Exception {
        Response preflight = request("OPTIONS", "/api/quests", null, null, Map.of(
            "Origin", "http://127.0.0.1:4028",
            "Access-Control-Request-Method", "POST",
            "Access-Control-Request-Headers", "content-type"));
        assertStatus(preflight, 200);
        assertThat(preflight.allowOrigin()).isEqualTo("http://127.0.0.1:4028");

        QuestContext quest = createAnonymousQuest(42);
        assertThat(quest.start().path("currentMonth").asInt()).isZero();
        assertThat(quest.start().path("grossIncome").decimalValue()).isEqualByComparingTo("25000.00");
        assertThat(quest.start().path("savingsBuckets").get(0).path("id").asText()).hasSize(36);

        assertError(request("GET", "/api/runs/" + quest.runId(), null, null), 401, "UNAUTHORIZED");
        Response state = request("GET", "/api/runs/" + quest.runId(), null, quest.token());
        assertStatus(state, 200);
        assertThat(state.json().path("runId").asText()).isEqualTo(quest.runId());
    }

    @Test
    @Order(3)
    void accountRegistrationLoginAndAccountOwnedQuestWork() throws Exception {
        String email = "compose-" + UUID.randomUUID() + "@example.com";
        String credentials = "{\"email\":\"" + email + "\",\"password\":\"correct-horse-battery\"}";

        Response registration = request("POST", "/api/auth/register", credentials, null);
        assertStatus(registration, 201);
        String accountToken = registration.json().path("accessToken").asText();
        assertThat(registration.json().path("user").path("email").asText()).isEqualTo(email);
        assertThat(registration.json().path("tokenType").asText()).isEqualTo("Bearer");

        assertError(request("POST", "/api/auth/register", credentials, null), 409, "EMAIL_IN_USE");

        Response login = request("POST", "/api/auth/login", credentials, null);
        assertStatus(login, 200);
        assertThat(login.json().path("accessToken").asText()).isNotBlank();

        String wrongPassword = "{\"email\":\"" + email + "\",\"password\":\"not-the-password\"}";
        assertError(request("POST", "/api/auth/login", wrongPassword, null), 401, "INVALID_CREDENTIALS");

        Response questResponse = request("POST", "/api/quests", "{\"seed\":15}", accountToken);
        assertStatus(questResponse, 201);
        assertThat(questResponse.json().get("accessToken")).isNull();
        String questId = questResponse.json().path("id").asText();
        Response start = request("POST", "/api/quests/" + questId + "/start", null, null);
        assertStatus(start, 200);
        String runId = start.json().path("runId").asText();
        assertStatus(request("GET", "/api/runs/" + runId, null, accountToken), 200);
    }

    @Test
    @Order(4)
    void bearerTokensCannotCrossRunOwnershipBoundaries() throws Exception {
        QuestContext first = createAnonymousQuest(101);
        QuestContext second = createAnonymousQuest(102);

        assertError(request("GET", "/api/runs/" + first.runId(), null, second.token()), 403, "RUN_FORBIDDEN");
        assertError(request("GET", "/api/runs/" + first.runId(), null, "not-a-jwt"), 401, "UNAUTHORIZED");
        assertError(request("GET", "/api/runs/not-a-real-run", null, first.token()), 404, "RUN_NOT_FOUND");
    }

    @Test
    @Order(5)
    void monthProgressionAndDecisionLifecycleArePersisted() throws Exception {
        QuestContext quest = createAnonymousQuest(77);
        String runPath = "/api/runs/" + quest.runId();

        Response monthOne = request("GET", runPath + "/next-event?month=1", null, quest.token());
        assertStatus(monthOne, 200);
        assertThat(monthOne.json().path("decisions").get(0).path("id").asText()).isEqualTo("decision-housing");
        assertThat(monthOne.json().path("transactions").toString()).contains("SALARY_NET");

        Response decision = request("POST", runPath + "/decisions/decision-housing",
            "{\"optionId\":\"opt-housing-mid\"}", quest.token());
        assertStatus(decision, 200);
        assertThat(decision.json().path("newState").path("housingChoice").asText()).isEqualTo("opt-housing-mid");
        assertThat(decision.json().path("newState").path("recurringCommitments").get(0).path("amount").decimalValue())
            .isEqualByComparingTo("9500.00");

        assertError(request("POST", runPath + "/decisions/decision-housing",
            "{\"optionId\":\"opt-housing-mid\"}", quest.token()), 409, "DECISION_COMPLETED");
        assertError(request("GET", runPath + "/next-event?month=3", null, quest.token()), 400, "MONTH_OUT_OF_ORDER");
        assertError(request("POST", runPath + "/decisions/decision-clothing",
            "{\"optionId\":\"opt-clothing-basic\"}", quest.token()), 400, "DECISION_NOT_AVAILABLE");

        Response monthTwo = request("GET", runPath + "/next-event?month=2", null, quest.token());
        assertStatus(monthTwo, 200);
        Response repeatedMonthTwo = request("GET", runPath + "/next-event?month=2", null, quest.token());
        assertStatus(repeatedMonthTwo, 200);
        assertThat(repeatedMonthTwo.json().path("events").size()).isZero();
        assertThat(repeatedMonthTwo.json().path("decisions").size()).isZero();
        assertThat(repeatedMonthTwo.json().path("transactions").size()).isGreaterThan(0);
        assertError(request("GET", runPath + "/next-event?month=13", null, quest.token()), 400, "BAD_REQUEST");
    }

    @Test
    @Order(6)
    void analyticsWhatIfAndReplayEndpointsUseTheRunState() throws Exception {
        QuestContext quest = createAnonymousQuest(88);
        String runPath = "/api/runs/" + quest.runId();

        Response health = request("GET", runPath + "/financial-health", null, quest.token());
        assertStatus(health, 200);
        assertThat(health.json().path("month").asInt()).isZero();
        assertThat(health.json().path("resilience").path("state").asText()).isEqualTo("Critical");

        Response year = request("GET", runPath + "/year-in-money", null, quest.token());
        assertStatus(year, 200);
        assertThat(year.json().path("monthlyBreakdown").size()).isEqualTo(12);
        assertThat(year.json().path("totalGrossIncome").decimalValue()).isEqualByComparingTo("300000.00");

        Response forks = request("GET", runPath + "/what-if", null, quest.token());
        assertStatus(forks, 200);
        assertThat(forks.json().size()).isEqualTo(3);
        assertThat(forks.json().get(0).path("id").asText()).isEqualTo("fork-apartment");

        Response beforeFork = request("GET", runPath, null, quest.token());
        Response fork = request("POST", runPath + "/what-if", "{\"forkId\":\"fork-savings\"}", quest.token());
        assertStatus(fork, 200);
        assertThat(fork.json().path("id").asText()).isEqualTo("fork-savings");
        assertError(request("POST", runPath + "/what-if", "{\"forkId\":\"missing-fork\"}", quest.token()),
            404, "FORK_NOT_FOUND");
        Response afterFork = request("GET", runPath, null, quest.token());
        assertThat(afterFork.json().path("currentMonth")).isEqualTo(beforeFork.json().path("currentMonth"));
        assertThat(afterFork.json().path("availableCash")).isEqualTo(beforeFork.json().path("availableCash"));

        Response replay = request("POST", runPath + "/replay", null, quest.token());
        assertStatus(replay, 200);
        assertThat(replay.json().path("runId").asText()).isNotEqualTo(quest.runId());
        assertThat(replay.json().path("seed").asInt()).isNotEqualTo(quest.start().path("seed").asInt());
        assertStatus(request("GET", "/api/runs/" + replay.json().path("runId").asText(), null, quest.token()), 200);
    }

    @Test
    @Order(7)
    void persistedRunSurvivesAnAppContainerRestart() throws Exception {
        QuestContext quest = createAnonymousQuest(1234);
        Response beforeRestart = request("GET", "/api/runs/" + quest.runId(), null, quest.token());
        assertStatus(beforeRestart, 200);

        runCompose("restart", "app");
        waitForApplication();

        Response afterRestart = request("GET", "/api/runs/" + quest.runId(), null, quest.token());
        assertStatus(afterRestart, 200);
        assertThat(afterRestart.json().path("runId")).isEqualTo(beforeRestart.json().path("runId"));
        assertThat(afterRestart.json().path("seed")).isEqualTo(beforeRestart.json().path("seed"));
    }

    private QuestContext createAnonymousQuest(int seed) throws Exception {
        Response quest = request("POST", "/api/quests", "{\"seed\":" + seed + "}", null);
        assertStatus(quest, 201);
        String questId = quest.json().path("id").asText();
        String token = quest.json().path("accessToken").asText();
        assertThat(questId).isNotBlank();
        assertThat(token).isNotBlank();

        Response start = request("POST", "/api/quests/" + questId + "/start", null, null);
        assertStatus(start, 200);
        return new QuestContext(start.json().path("runId").asText(), token, start.json());
    }

    private void waitForApplication() throws Exception {
        Instant deadline = Instant.now().plus(Duration.ofMinutes(3));
        Throwable lastFailure = null;
        while (Instant.now().isBefore(deadline)) {
            try {
                Response response = request("GET", "/v3/api-docs", null, null);
                if (response.status() == 200) return;
                lastFailure = new AssertionError("Application returned HTTP " + response.status() + ": " + response.body());
            } catch (Exception exception) {
                lastFailure = exception;
            }
            Thread.sleep(1000);
        }
        fail("Timed out waiting for Docker Compose application", lastFailure);
    }

    private Response request(String method, String path, String body, String token) throws IOException, InterruptedException {
        return request(method, path, body, token, Map.of());
    }

    private Response request(String method, String path, String body, String token, Map<String, String> headers)
        throws IOException, InterruptedException {
        HttpRequest.Builder builder = HttpRequest.newBuilder(URI.create(BASE_URL + path))
            .timeout(HTTP_TIMEOUT)
            .header("Accept", "application/json");
        if (body != null) builder.header("Content-Type", "application/json");
        if (token != null) builder.header("Authorization", "Bearer " + token);
        headers.forEach(builder::header);
        HttpRequest.BodyPublisher publisher = body == null
            ? HttpRequest.BodyPublishers.noBody()
            : HttpRequest.BodyPublishers.ofString(body);
        java.net.http.HttpResponse<String> response = http.send(
            builder.method(method, publisher).build(), java.net.http.HttpResponse.BodyHandlers.ofString());
        return new Response(response.statusCode(), response.body(),
            response.headers().firstValue("Access-Control-Allow-Origin").orElse(null));
    }

    private CommandResult runCompose(String... arguments) throws IOException, InterruptedException {
        Path envFile = Files.createTempFile("moneyquest-compose-", ".env");
        List<String> command = new ArrayList<>(List.of("docker", "compose", "--file",
            REPOSITORY_ROOT.resolve("docker-compose.yaml").toString(), "--env-file", envFile.toString(),
            "--project-name", composeProject));
        command.addAll(Arrays.asList(arguments));
        Path outputFile = Files.createTempFile("moneyquest-compose-", ".log");
        ProcessBuilder processBuilder = new ProcessBuilder(command)
            .directory(REPOSITORY_ROOT.toFile())
            .redirectErrorStream(true)
            .redirectOutput(outputFile.toFile());
        processBuilder.environment().put("MONEYQUEST_PGDATA_VOLUME", postgresVolume);
        processBuilder.environment().putIfAbsent("MONEYQUEST_JWT_SECRET", "moneyquest-compose-integration-test-secret-32-bytes");
        try {
            Files.writeString(envFile,
                "MONEYQUEST_PGDATA_VOLUME=" + postgresVolume + "\n"
                    + "MONEYQUEST_JWT_SECRET=moneyquest-compose-integration-test-secret-32-bytes\n",
                StandardCharsets.UTF_8);
            Process process = processBuilder.start();
            if (!process.waitFor(COMPOSE_TIMEOUT.toSeconds(), TimeUnit.SECONDS)) {
                process.destroyForcibly();
                throw new IllegalStateException("Docker Compose command timed out: " + String.join(" ", command));
            }
            String output = Files.readString(outputFile, StandardCharsets.UTF_8);
            if (process.exitValue() != 0) {
                throw new IllegalStateException("Docker Compose command failed (" + process.exitValue() + "): " + output);
            }
            return new CommandResult(process.exitValue(), output);
        } finally {
            Files.deleteIfExists(envFile);
            Files.deleteIfExists(outputFile);
        }
    }

    private static void assertStatus(Response response, int expected) {
        assertThat(response.status()).as("HTTP response body: %s", response.body()).isEqualTo(expected);
    }

    private static void assertError(Response response, int expectedStatus, String expectedCode) throws IOException {
        assertStatus(response, expectedStatus);
        assertThat(response.json().path("code").asText()).isEqualTo(expectedCode);
    }

    private static Path findRepositoryRoot() {
        Path candidate = Path.of(System.getProperty("user.dir")).toAbsolutePath().normalize();
        while (candidate != null) {
            if (Files.isRegularFile(candidate.resolve("docker-compose.yaml"))) return candidate;
            candidate = candidate.getParent();
        }
        throw new IllegalStateException("Could not locate repository-root docker-compose.yaml");
    }

    private static String trimTrailingSlash(String value) {
        return value.endsWith("/") ? value.substring(0, value.length() - 1) : value;
    }

    private record QuestContext(String runId, String token, JsonNode start) { }
    private record Response(int status, String body, String allowOrigin) {
        private JsonNode json() throws IOException { return JSON.readTree(body); }
    }
    private record CommandResult(int exitCode, String output) { }
}
