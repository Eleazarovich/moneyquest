package com.moneyquest.api;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.moneyquest.api.dto.ApiDtos;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class MoneyQuestApiIntegrationTest {
    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;

    @Test
    void openApiDocumentationIsPublic() throws Exception {
        mockMvc.perform(get("/v3/api-docs"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.info.title").value("MoneyQuest Backend API"))
            .andExpect(jsonPath("$.paths['/api/runs/{id}'].get.security[0].bearerAuth").isArray());

        mockMvc.perform(get("/swagger-ui/index.html"))
            .andExpect(status().isOk());
    }

    @Test
    void loopbackFrontendOriginCanUseCorsBootstrap() throws Exception {
        mockMvc.perform(options("/api/quests")
                .header("Origin", "http://127.0.0.1:4028")
                .header("Access-Control-Request-Method", "POST")
                .header("Access-Control-Request-Headers", "content-type"))
            .andExpect(status().isOk())
            .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.header()
                .string("Access-Control-Allow-Origin", "http://127.0.0.1:4028"));
    }

    @Test
    void publicBootstrapReturnsTokenAndProtectedRunRequiresIt() throws Exception {
        MvcResult questResult = mockMvc.perform(post("/api/quests")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"seed\":42}"))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").isString())
            .andExpect(jsonPath("$.accessToken").isString())
            .andReturn();
        ApiDtos.QuestResponse quest = objectMapper.readValue(questResult.getResponse().getContentAsString(), ApiDtos.QuestResponse.class);

        MvcResult startResult = mockMvc.perform(post("/api/quests/{id}/start", quest.id()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.currentMonth").value(0))
            .andExpect(jsonPath("$.grossIncome").value(25000.0))
            .andExpect(jsonPath("$.savingsBuckets[0].id").value(org.hamcrest.Matchers.hasLength(36)))
            .andReturn();
        JsonNode state = objectMapper.readTree(startResult.getResponse().getContentAsString());
        String runId = state.get("runId").asText();

        mockMvc.perform(get("/api/runs/{id}", runId))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.code").value("UNAUTHORIZED"));
        mockMvc.perform(get("/api/runs/{id}", runId).header("Authorization", "Bearer " + quest.accessToken()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.runId").value(runId));
    }

    @Test
    void processMonthAndDecisionArePersistedAndDuplicateDecisionIsConflict() throws Exception {
        QuestAndRun quest = createAnonymousRun(77);

        mockMvc.perform(get("/api/runs/{id}/next-event", quest.runId())
                .param("month", "1")
                .header("Authorization", "Bearer " + quest.token()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.decisions[0].id").value("decision-housing"))
            .andExpect(jsonPath("$.transactions.length()").value(4));

        mockMvc.perform(post("/api/runs/{id}/decisions/{decisionId}", quest.runId(), "decision-housing")
                .header("Authorization", "Bearer " + quest.token())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"optionId\":\"opt-housing-mid\"}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.newState.housingChoice").value("opt-housing-mid"))
            .andExpect(jsonPath("$.newState.recurringCommitments[0].amount").value(9500.0));

        mockMvc.perform(post("/api/runs/{id}/decisions/{decisionId}", quest.runId(), "decision-housing")
                .header("Authorization", "Bearer " + quest.token())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"optionId\":\"opt-housing-mid\"}"))
            .andExpect(status().isConflict())
            .andExpect(jsonPath("$.code").value("DECISION_COMPLETED"));
    }

    @Test
    void differentBootstrapTokenCannotAccessAnotherRun() throws Exception {
        QuestAndRun first = createAnonymousRun(101);
        QuestAndRun second = createAnonymousRun(102);

        mockMvc.perform(get("/api/runs/{id}", first.runId())
                .header("Authorization", "Bearer " + second.token()))
            .andExpect(status().isForbidden())
            .andExpect(jsonPath("$.code").value("RUN_FORBIDDEN"));
    }

    @Test
    void accountPasswordsAreHashedAndLoginIssuesBearerToken() throws Exception {
        String email = "player-" + UUID.randomUUID() + "@example.com";
        String credentials = "{\"email\":\"" + email + "\",\"password\":\"correct-horse-battery\"}";
        mockMvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON).content(credentials))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.accessToken").isString())
            .andExpect(jsonPath("$.user.email").value(email));
        mockMvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON).content(credentials))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.tokenType").value("Bearer"));
        mockMvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"" + email + "\",\"password\":\"not-the-password\"}"))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.code").value("INVALID_CREDENTIALS"));
    }

    private QuestAndRun createAnonymousRun(int seed) throws Exception {
        MvcResult questResult = mockMvc.perform(post("/api/quests")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"seed\":" + seed + "}"))
            .andExpect(status().isCreated()).andReturn();
        ApiDtos.QuestResponse quest = objectMapper.readValue(questResult.getResponse().getContentAsString(), ApiDtos.QuestResponse.class);
        MvcResult startResult = mockMvc.perform(post("/api/quests/{id}/start", quest.id()))
            .andExpect(status().isOk()).andReturn();
        String runId = objectMapper.readTree(startResult.getResponse().getContentAsString()).get("runId").asText();
        return new QuestAndRun(runId, quest.accessToken());
    }

    private record QuestAndRun(String runId, String token) { }
}
