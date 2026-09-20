SHELL := /bin/bash

BACKEND_DIR := backend
MVNW := ./mvnw

.DEFAULT_GOAL := help

.PHONY: help run test verify package clean docker-up docker-down docker-logs

help: ## Show available commands
	@grep -E '^[a-zA-Z0-9_-]+:.*## ' $(MAKEFILE_LIST) | sed 's/:.*## /\t/'

run: ## Start the backend with the development SQLite database
	cd $(BACKEND_DIR) && $(MVNW) spring-boot:run

test: ## Run backend tests
	cd $(BACKEND_DIR) && $(MVNW) test

verify: ## Run the full backend verification lifecycle
	cd $(BACKEND_DIR) && $(MVNW) clean verify

package: ## Build the executable backend jar
	cd $(BACKEND_DIR) && $(MVNW) package

clean: ## Remove backend build output
	cd $(BACKEND_DIR) && $(MVNW) clean

docker-up: ## Build and start PostgreSQL plus the backend
	cd $(BACKEND_DIR) && docker compose up --build

docker-down: ## Stop the Docker Compose services
	cd $(BACKEND_DIR) && docker compose down

docker-logs: ## Follow backend Docker Compose logs
	cd $(BACKEND_DIR) && docker compose logs -f backend
