const webpack = require('webpack')
const path = require('path')
const AssetsWebpackPlugin = require('assets-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const rootPath = process.cwd()
const isProduction = process.env.NODE_ENV === 'production'
const plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': process.env.NODE_ENV
  })
]

if (isProduction) {
  plugins.push(
    new AssetsWebpackPlugin({ path: path.resolve(rootPath, 'dist') })
  )
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      mangle: {
        screw_ie8: true,
        keep_fnames: true
      },
      compress: {
        screw_ie8: true
      },
      comments: false
    })
  )
} else {
  plugins.push(new BundleAnalyzerPlugin())
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
        test: /\.svg$/,
        use: ['desvg-loader/preact', 'svg-loader']
      },

      {
        test: /\.(png|jpg|jpeg|gif)$/,
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
