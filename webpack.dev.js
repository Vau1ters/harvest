const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    static: './public',
    port: 3001,
  },
  devtool: "eval-source-map",
})
