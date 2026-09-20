For the backend, use Java 21 with Spring Boot and Maven.

Backend stack:
- Spring Data JPA / Hibernate
- SQLite for development
- PostgreSQL for production
- Flyway for database migrations
- Spring Security
- OpenAPI
- JUnit 5
- Testcontainers
- Docker

Use JPA/Hibernate as the database abstraction so the application can work with SQLite in development and PostgreSQL in production. Avoid database-specific code where possible.

Use the Maven wrapper for dependency management and builds. A few useful commands:

./mvnw spring-boot:run
./mvnw test
./mvnw clean verify
./mvnw package

Follow the OpenAPI contract as the source of truth for the API.

Commit to git every time you complete a meaningful working change. Keep commits small and focused. Do not wait until the end of a task to commit all changes at once.