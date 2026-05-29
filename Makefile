up:
	docker-compose up -d
down:
	docker-compose down
rebuild:
	docker-compose down && docker-compose build --no-cache && docker-compose up -d
logs:
	docker-compose logs -f api
migrate:
	docker-compose exec -T api npx prisma migrate dev