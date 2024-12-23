DOCKER_IMAGE := trello-dashboard
APP_DIR := frontend

.PHONY: usage
usage:
	@echo "USAGE:"
	@echo "   make command [options]"
	@echo
	@echo "COMMANDS:"
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed 's/^/   /' | sed -e 's/\\$$/AA/' | sed -e 's/#//g' | column -t -s ":" | sort -k1

.PHONY: install
install: ## Install all dependencies
	cd $(APP_DIR) && npm install

.PHONY: build
build: ## Build app
	cd $(APP_DIR) && npm run build

.PHONY: start
start: ## Start app
	cd $(APP_DIR) && npm start

.PHONY: check
check: ## Runs linter on the code
	cd $(APP_DIR) && npm run lint
	cd $(APP_DIR) && npm run check-format

.PHONY: format
format: ## Format the code
	cd $(APP_DIR) && npm run format

.PHONY: docker-build
docker-build: ## Build docker image
	docker build -t $(DOCKER_IMAGE):local -f Dockerfile .

.PHONY: docker-run
docker-run: ## Build docker image
	docker run -d -p 3000:3000 $(DOCKER_IMAGE):local