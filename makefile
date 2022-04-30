.PHONY: help

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

start-db: ## Start local db
	docker run --name payme-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres

stop-db: ## Stops and removes local db
	docker rm -f payme-postgres

run: ## Start local instance of the app and connect to planetscale dev instance
	@pnpm install
	pscale connect payme dev &
	@pnpm run dev

# npx prisma migrate dev --name init