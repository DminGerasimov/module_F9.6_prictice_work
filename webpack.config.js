const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
	entry: "./src/news_service.js",

	plugins: [
     new htmlWebpackPlugin({
      title: 'Development',
      template: "./src/news_service.html"
     }),
   ],

	output: {
		path: path.join(__dirname, "/dist"),
		filename: "bundle.js",
		clean: true
	},

	module:{
		rules:[
			{
			  test: /\.js/,
			  exclude: /node_modules/,
			  include: path.resolve(__dirname, 'src'),
			  
			},
			{
				test: /\.css$/,
			}
		]
	},
}