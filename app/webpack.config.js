var webpack=require('webpack');
module.exports={
	entry:'./runoob1.js',
	output:{
		path:__dirname,
		filename:'bundle.js'
	},
	module:{
		loaders:[
		{test:/\.css$/,loader:'style!css'}
		]
	},
	plugins:[
	new webpack.BannerPlugin('1214235')]
};