FROM node:22-alpine AS frontend-build

WORKDIR /workspace/frontend

COPY frontend/package.json ./
RUN npm install --no-audit --no-fund

COPY frontend/ ./

ARG NEXT_PUBLIC_API_BASE_URL=
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
RUN npm run build

FROM eclipse-temurin:21-jdk-alpine AS backend-build

WORKDIR /workspace/backend

COPY backend/.mvn .mvn
COPY backend/mvnw backend/pom.xml ./
RUN chmod +x mvnw

COPY backend/src ./src
COPY --from=frontend-build /workspace/frontend/out ./src/main/resources/static
RUN ./mvnw -B -DskipTests package

FROM eclipse-temurin:21-jre-alpine AS runtime

WORKDIR /app
RUN addgroup -S spring && adduser -S -G spring spring \
    && mkdir -p /app /data \
    && chown -R spring:spring /app /data

COPY --from=backend-build --chown=spring:spring \
    /workspace/backend/target/moneyquest-backend-*.jar /app/app.jar

USER spring
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
