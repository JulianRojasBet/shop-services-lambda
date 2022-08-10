const path = require('path');
const slsw = require('serverless-webpack');

module.exports = {
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  entry: slsw.lib.entries,
  resolve: {
    extensions: ['.ts', '.json'],
    alias: {
      constants: path.resolve(__dirname, './constants/'),
    }
  },
  target: 'node',
  externals: {
    'aws-sdk': 'aws-sdk',
    '@aws-sdk/client-s3': '@aws-sdk/client-s3',
  },
  module: {
    rules: [
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
}