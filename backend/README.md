# MoneyQuest backend

Spring Boot 3 / Java 21 backend for the MoneyQuest simulation. Flyway owns the schema and JPA/Hibernate owns persistence.

The default `dev` profile uses SQLite at `backend/data/moneyquest.db`. The `prod`
profile uses PostgreSQL and requires the `DATABASE_URL`, `DATABASE_USERNAME`, and
`DATABASE_PASSWORD` environment variables.

Run locally:

```bash
./mvnw spring-boot:run
```

Run with an explicit profile when needed:

```bash
SPRING_PROFILES_ACTIVE=dev ./mvnw spring-boot:run
SPRING_PROFILES_ACTIVE=prod DATABASE_URL=jdbc:postgresql://localhost:5432/moneyquest \
  DATABASE_USERNAME=moneyquest DATABASE_PASSWORD=moneyquest ./mvnw spring-boot:run
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

The Docker Compose backend runs with `SPRING_PROFILES_ACTIVE=prod` and passes the
PostgreSQL connection settings through environment variables. Production
deployments should provide their own `DATABASE_PASSWORD` and
`MONEYQUEST_JWT_SECRET` instead of the development values in the compose file.
