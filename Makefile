bash:
	docker compose -f docker-compose.yml run --rm base bash

install:
	docker compose -f docker-compose.yml run --rm install

build:
	docker compose -f docker-compose.yml run --rm build

startlocalstack:
	docker compose -f docker-compose-localstack.yml up -d

stoplocalstack:
	docker compose -f docker-compose-localstack.yml down