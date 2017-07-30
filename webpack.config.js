const path = require('path')

const rootDir = process.cwd()

module.exports = {
  entry: './app/index.js',
  output: {
    filename: 'bundle.js',
    path: path.join(rootDir, 'dist')
  }
}
