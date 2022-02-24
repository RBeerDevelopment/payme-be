.PHONY: help

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

start-db: ## Start local db
	docker run --name payme-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres

stop-db: ## Stops and removes local db
	docker rm -f payme-postgres

run: ## Start local serverless instance of the app
	@yarn generate-nexus
	@yarn generate-prisma
	@yarn dev

package: ## Package for production
	@yarn install
	@yarn generate-prisma
	sls package --verbose

# npx prisma migrate dev --name init