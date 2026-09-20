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

The public bootstrap flow is:

1. `POST /api/quests` with an optional `{"seed": 42}`. Anonymous callers receive a signed bootstrap bearer token in `accessToken`.
2. `POST /api/quests/{id}/start` to create the initial player state.
3. Send the bootstrap token in `Authorization: Bearer ...` to the protected run endpoints.

Account callers can use `POST /api/auth/register` or `POST /api/auth/login` and then create quests with their account bearer token. Passwords are stored with BCrypt; JWT signing is configured through `MONEYQUEST_JWT_SECRET`.

For PostgreSQL:

```bash
docker compose up --build
```
