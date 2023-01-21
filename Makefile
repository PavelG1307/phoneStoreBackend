run:
	docker run --rm -d -p 3000:3000 --name phonestore pavelg1307/phonestore
run-dev:
	npm run start:dev
compose:
	docker-compose -f ./docker-compose.yml up -d --force-recreate
build:
	docker build -t pavelg1307/phonestore .