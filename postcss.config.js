module.exports = {
  plugins: {
    'postcss-import': { path: [process.cwd()] }, // Allows to import root-relative paths
    'postcss-cssnext': {},
    cssnano: {}
  }
}
