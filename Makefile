SHELL := /bin/bash
NODE_BIN_PATH := $(shell npm bin)
PATH := $(NODE_BIN_PATH):$(PATH)

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

deploy-hosting:
	npm run deploy -- --only hosting

lint:
	esw

lint-watch:
	esw --watch
