var path = require('path');

module.exports = {
  entry: './js/src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'js/dist')
  }
}
