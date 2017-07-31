#!/usr/bin/env node

const webpack = require('webpack')
const Koa = require('koa')
const koaWebpack = require('koa-webpack')
const koaStatic = require('koa-static')
const webpackConfig = require('../webpack.config')
const ejs = require('ejs')
const fsp = require('fs-promise')
const path = require('path')

const app = new Koa()
const webpackCompiler = webpack(webpackConfig)
const port = 5000
const rootPath = process.cwd()

app
  .use(koaStatic(path.resolve(rootPath, 'app/UI/public')))
  .use(koaWebpack({ compiler: webpackCompiler }))
  .use(async ctx => {
    const templateContent = await fsp.readFile(path.join(rootPath, 'index.ejs'))
    const template = ejs.compile(templateContent.toString())

    ctx.body = template({
      entryPath: (entryName, type = 'js') => `/assets/${entryName}.${type}`,
      env: process.env.NODE_ENV
    })
  })

const server = app.listen(port, '0.0.0.0')

console.log(`Listening at http://localhost:${port}`)
