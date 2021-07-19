const Dotenv = require('dotenv-webpack');

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development'

module.exports = {
  mode: mode,
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
    new Dotenv({
      systemvars: true
    })
  ]
}
