.PHONY: dev build up down restart logs clean

# Development mode with volume mounts
dev:
	docker-compose -f docker-compose.dev.yml up

# Build all services
build:
	docker-compose build

# Start all services in detached mode
up:
	docker-compose up -d

# Stop all services
down:
	docker-compose down

# Restart all services
restart:
	docker-compose restart

# View logs
logs:
	docker-compose logs -f

# Clean up Docker resources
clean:
	docker-compose down -v
	docker system prune -f 