install:
	npm install

start:
	npm start

build:
	npm run build

test:
	npm test

test-watch:
	npm test -- --watch

deploy:
	npm run deploy

deploy-functions:
	npm run deploy -- --only functions
