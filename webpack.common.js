/* eslint-disable @typescript-eslint/no-var-requires */
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ESLintWebpackPlugin = require('eslint-webpack-plugin')
const TsconfigPathsWebpackPlugin = require('tsconfig-paths-webpack-plugin')

module.exports = {
  entry: './src/index.ts',
  output: {
    path: `${__dirname}/dist`,
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
      },
      {
        test: /\.png$/,
        exclude: /node_modules/,
        loader: 'url-loader',
      },
      {
        test: /\.html$/,
        exclude: /node_modules/,
        loader: 'html-loader',
      },
    ]
  },
  resolve: {
    extensions: ['.ts', '.js'],
    plugins: [
      new TsconfigPathsWebpackPlugin({
        configFile: 'tsconfig.json',
      }),
    ]
  },
  watchOptions: {
    ignored: /autogen/,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new ESLintWebpackPlugin({
      extensions: ['.ts', 'js'],
      exclude: 'node_modules',
      fix: true,
    }),
  ]
}
