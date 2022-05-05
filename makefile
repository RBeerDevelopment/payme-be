.PHONY: help

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

run: ## Start local instance of the app and connect to planetscale dev instance
	@pnpm install
	pscale connect payme dev &
	@pnpm run dev

run-ci:
	@pnpm 