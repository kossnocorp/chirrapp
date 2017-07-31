const path = require('path')
const AssetsWebpackPlugin = require('assets-webpack-plugin')

const rootPath = process.cwd()
const isProduction = process.env.NODE_ENV === 'production'
const plugins = []

if (isProduction) {
  plugins.push(
    new AssetsWebpackPlugin({ path: path.resolve(rootPath, 'dist') })
  )
}

module.exports = {
  entry: {
    app: './app/index.jsx'
  },

  output: {
    path: path.resolve(rootPath, 'dist/assets'),
    publicPath: '/assets/',
    filename: isProduction ? '[name]-[chunkhash].js' : '[name].js',
    chunkFilename: isProduction ? '[id]-[chunkhash].js' : '[id].js'
  },

  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: 'babel-loader'
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        use: 'file-loader'
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'decss-loader/preact',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: '[local]-[hash:base64:5]'
            }
          },
          'postcss-loader'
        ]
      }
    ]
  },

  plugins
}
