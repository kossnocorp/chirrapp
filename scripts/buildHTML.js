#!/usr/bin/env node

const ejs = require('ejs')
const fsp = require('fs-promise')
const path = require('path')

const rootPath = process.cwd()

Promise.all([buildTemplate(), readManifest()])
  .then(([template, manifest]) => {
    return template({
      entryPath: (entryName, type = 'js') => manifest[entryName][type],
      env: process.env.NODE_ENV
    })
  })
  .then(html => {
    return fsp.writeFile(path.resolve(rootPath, 'dist/index.html'), html)
  })

function buildTemplate () {
  return fsp
    .readFile(path.join(rootPath, 'index.ejs'))
    .then(templateContent => ejs.compile(templateContent.toString()))
}

function readManifest () {
  return fsp
    .readFile(path.resolve(rootPath, 'dist/webpack-assets.json'))
    .then(content => JSON.parse(content))
}
