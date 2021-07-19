const Dotenv = require('dotenv-webpack');

module.exports = {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },

  devtool: 'source-map',

  devServer: {
    contentBase: './dist'
  },

  plugins: [
    new Dotenv()
  ]
}
