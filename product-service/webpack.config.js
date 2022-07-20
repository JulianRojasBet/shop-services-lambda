const path = require('path');
const slsw = require('serverless-webpack');

module.exports = {
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  entry: slsw.lib.entries,
  resolve: {
    extensions: ['.ts', '.json'],
    alias: {
      mocks: path.resolve(__dirname, './mocks/')
    }
  },
  target: 'node',
  module: {
    rules: [
      // {
      //   test: /\.(json)$/,
      //   type: 'asset/source'
      // },
      {
        test: /\.(ts)$/,
        loader: 'ts-loader',
        exclude: [
          [
            path.resolve(__dirname, 'node_modules'),
            path.resolve(__dirname, '.serverless'),
            path.resolve(__dirname, '.webpack'),
          ],
        ],
      },
    ],
  },
};