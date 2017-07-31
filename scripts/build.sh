#!/bin/bash

set -ex

PATH="$(npm bin):$PATH"
export NODE_ENV=production

rm -rf dist
webpack
./scripts/buildHTML.js
cp -r app/UI/public/* dist
