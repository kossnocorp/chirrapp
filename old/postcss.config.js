const path = require('path')

module.exports = {
  plugins: {
    'postcss-import': { path: [path.resolve(process.cwd(), 'src')] }, // Allows to import root-relative paths
    'postcss-cssnext': {},
    cssnano: {}
  }
}
