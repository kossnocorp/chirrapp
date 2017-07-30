const path = require('path')

const rootDir = process.cwd()

module.exports = {
  entry: './app/index.jsx',
  output: {
    filename: 'bundle.js',
    path: path.join(rootDir, 'dist')
  },

  module: {
    rules: [
      {
        test: /\.jsx?/, use: 'babel-loader'
      }
    ]
  }
}
