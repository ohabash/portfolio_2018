const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
var path = require('path');

module.exports = {
  entry: './assets/js/index.js',
  output: {
    filename: 'bundle.js',
    path: here('dist')
  },
};

// module.exports = {
//   plugins: [
//     new UglifyJsPlugin()
//   ]
// }

function j() {
new webpack.ProvidePlugin({
'window.jQuery': 'jquery',
'windows.$': 'jquery'
});
}


function here(d) {
	if (!d){ return __dirname; }
	return path.resolve(__dirname, d);
}