.PHONY: help

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

start-db: ## Start local db
	docker run --name payme-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres

stop-db: ## Stops and removes local db
	docker rm -f payme-postgres

run: ## Start local serverless instance of the app
	@npm run generate-nexus
	@npm run dev

package: ## Package for production
	@npm i
	@npm run generate-nexus
	sls package --verbose

deploy-staging: ## Deploy to staging env
	rm -rf node_modules
	@npm i
	@npm run generate-nexus
	serverless deploy --stage staging

deploy-prod: ## Deploy to prod env
	rm -rf node_modules
	@npm i
	@npm run generate-nexus
	serverless deploy --stage prod