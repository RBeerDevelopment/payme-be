.PHONY: help

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

run: ## Start local instance of the app
	docker rm -f $(docker ps | grep "0.0.0.0:3000" | cut -c1-4) || true
	docker build -t payme-be .
	docker run -p 3000:3000 payme-be 

dev: ## Start dev instance with hot-reloading on code changes
	docker rm -f $(docker ps | grep "0.0.0.0:3000" | cut -c1-4) || true
	docker build -t payme-be:dev -f Dockerfile.dev .
	docker compose -f docker-compose.dev.yml up payme-be 


run-ci:
	@pnpm 