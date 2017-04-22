var path = require('path');

module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'js')
  },
  devServer: {
   headers: {
     "Access-Control-Allow-Origin": "*",
     "Access-Control-Allow-Methods": "GET",
     "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
   }
 },
 module: {
  rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      options: {
        presets: [
          ['es2015', {modules: false }]
        ]
      }
    }
  ]
},
}
