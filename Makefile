SHELL := /bin/bash
BIN := $(shell npm bin)

install:
	npm install

# Development server

start:
	npm start

start-functions:
	${BIN}/firebase serve --only functions

# Tests

test:
	npm test

test-watch:
	npm test -- --watch

# Linting

lint:
	${BIN}/esw

lint-watch:
	${BIN}/esw --watch

# Production deployment

deploy: build
	${BIN}/firebase deploy

deploy-functions:
	${BIN}/firebase deploy --only functions

deploy-hosting:
	${BIN}/firebase deploy --only hosting

# Staging deployment

deploy-staging:
	${BIN}/firebase deploy --project chirrapp-staging

deploy-functions-staging:
	${BIN}/firebase deploy --project chirrapp-staging --only functions

deploy-hosting-staging:
	${BIN}/firebase deploy --project chirrapp-staging --only hosting

# Building

build:
	./scripts/build.sh
