SHELL := /bin/bash
NODE_BIN_PATH := $(shell npm bin)
PATH := $(NODE_BIN_PATH):$(PATH)

install:
	npm install

# Development server

start:
	npm start

start-functions:
	firebase serve --only functions

# Tests

test:
	npm test

test-watch:
	npm test -- --watch

# Linting

lint:
	esw

lint-watch:
	esw --watch

# Production deployment

deploy:
	firebase deploy

deploy-functions:
	firebase deploy --only functions

deploy-hosting:
	firebase deploy --only hosting

# Staging deployment

deploy-staging:
	firebase deploy --project chirrapp-staging

deploy-staging-functions:
	firebase deploy --project chirrapp-staging --only functions

deploy-staging-hosting:
	firebase deploy --project chirrapp-staging --only hosting

# Building

build:
	./scripts/build.sh
