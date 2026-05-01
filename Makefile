.PHONY: help install dev test lint format build docker-up docker-down clean
.DEFAULT_GOAL := help

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-14s\033[0m %s\n", $$1, $$2}'

install: ## Install backend (uv) and frontend (npm) dependencies
	cd backend && uv sync --extra dev
	cd frontend && npm install

dev: ## Run backend (uvicorn) + frontend (vite) concurrently
	@trap 'kill 0' INT TERM EXIT; \
	(cd backend && .venv/bin/uvicorn app.main:app --reload --port 8000) & \
	(cd frontend && npm run dev) & \
	wait

backend-dev: ## Run only the backend (port 8000)
	cd backend && .venv/bin/uvicorn app.main:app --reload --port 8000

frontend-dev: ## Run only the frontend (port 5173)
	cd frontend && npm run dev

test: ## Run backend pytest + frontend typecheck
	cd backend && .venv/bin/pytest -q
	cd frontend && npm run typecheck

lint: ## Run ruff (backend) + eslint (frontend)
	cd backend && .venv/bin/ruff check .
	cd backend && .venv/bin/ruff format --check .
	cd frontend && npm run lint

format: ## Apply ruff format + prettier
	cd backend && .venv/bin/ruff format .
	cd backend && .venv/bin/ruff check --fix .
	cd frontend && npm run format

build: ## Build the frontend production bundle
	cd frontend && npm run build

docker-up: ## docker-compose up (local dev)
	docker-compose up --build

docker-down: ## docker-compose down
	docker-compose down

clean: ## Clean caches, dist, __pycache__
	find . -type d -name "__pycache__" -prune -exec rm -rf {} +
	find . -type d -name ".pytest_cache" -prune -exec rm -rf {} +
	find . -type d -name ".ruff_cache" -prune -exec rm -rf {} +
	rm -rf backend/.venv frontend/node_modules frontend/dist frontend/.vite
