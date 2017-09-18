const webpack = require('webpack')
const path = require('path')
const AssetsWebpackPlugin = require('assets-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const appEnv = process.env.APP_ENV || 'development'
const nodeEnv = process.env.NODE_ENV || 'development'
const rootPath = process.cwd()
const isProduction = nodeEnv === 'production'
const plugins = [
  new webpack.DefinePlugin({
    'process.env.APP_ENV': JSON.stringify(appEnv),
    'process.env.NODE_ENV': JSON.stringify(nodeEnv)
  })
]

if (isProduction) {
  plugins.push(
    new AssetsWebpackPlugin({ path: path.resolve(rootPath, 'dist/app') })
  )
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
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
  plugins.push(
    new BundleAnalyzerPlugin({
      openAnalyzer: false
    })
  )
}

module.exports = {
  entry: {
    app: './src/app/index.jsx'
  },

  output: {
    path: path.resolve(rootPath, 'dist/app/assets'),
    publicPath: '/assets/',
    filename: isProduction ? '[name]-[chunkhash].js' : '[name].js',
    chunkFilename: isProduction ? '[id]-[chunkhash].js' : '[id].js'
  },

  resolve: {
    extensions: ['.js', '.jsx', '.json', '.css'],
    modules: [path.resolve(rootPath, 'src'), 'node_modules']
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: 'babel-loader'
      },

      {
        test: /\.svg$/,
        use: [
          {
            loader: 'hoc-loader',
            options: {
              useDefault: true,
              path: path.resolve(rootPath, 'src/app/UI/_lib/Icon/index.jsx')
            }
          }
        ],
        include: path.resolve(rootPath, 'src/app/UI/_lib/Icon')
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

  devtool: isProduction ? 'source-map' : 'eval-source-map',

  plugins
}
