# MoneyQuest backend

Spring Boot 3 / Java 21 backend for the MoneyQuest simulation. The default profile uses SQLite at `backend/data/moneyquest.db`; the `postgres` profile uses PostgreSQL. Flyway owns the schema and JPA/Hibernate owns persistence.

Run locally:

```bash
./mvnw spring-boot:run
```

Run checks:

```bash
./mvnw test
./mvnw clean verify
```

Interactive API documentation is available while the backend is running:

- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`
- OpenAPI YAML: `http://localhost:8080/v3/api-docs.yaml`

Use Swagger UI's **Authorize** button with the `accessToken` returned by
account login/registration or anonymous quest creation. The run endpoints
will otherwise return `401 UNAUTHORIZED`.

The public bootstrap flow is:

1. `POST /api/quests` with an optional `{"seed": 42}`. Anonymous callers receive a signed bootstrap bearer token in `accessToken`.
2. `POST /api/quests/{id}/start` to create the initial player state.
3. Send the bootstrap token in `Authorization: Bearer ...` to the protected run endpoints.

Account callers can use `POST /api/auth/register` or `POST /api/auth/login` and then create quests with their account bearer token. Passwords are stored with BCrypt; JWT signing is configured through `MONEYQUEST_JWT_SECRET`.

For PostgreSQL:

```bash
docker compose up --build
```
