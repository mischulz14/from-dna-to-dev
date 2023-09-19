const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './src/app.ts',
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: 'assets', to: 'assets' }],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true, // This will ignore all TS errors
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'development',
};
