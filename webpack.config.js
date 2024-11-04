const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env, argv) => {
	const isProduction = argv.mode === 'production';
	return {
		entry: {
			app: './src/index.ts',
			style: './src/style.ts',
		},
		mode: isProduction ? 'production' : 'development',
		devtool: !isProduction ? 'cheap-module-source-map' : false,
		cache: {
			type: 'filesystem',
		},
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					use: {
						loader: 'ts-loader',
						options: {
							configFile: isProduction ? 'tsconfig.prod.json' : 'tsconfig.dev.json'
						}
					},
					exclude: /node_modules/
				},
				{
					test: /\.(scss|css)$/,
					use: [
						isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
						{
							loader: 'css-loader',
							options: {
								sourceMap: !isProduction,
							},
						},
						{
							loader: 'postcss-loader',
							options: {
								postcssOptions: {
									plugins: [autoprefixer],
								},
							},
						},
						'sass-loader',
					],
				},
			],
		},
		resolve: {
			extensions: ['.ts', '.js'],
		},
		output: {
			filename: isProduction ? '[name].[contenthash].js' : '[name].js',
			path: path.resolve(__dirname, 'public/dist'),
			clean: true,
			pathinfo: false,
		},
		optimization: {
			minimize: isProduction,
			minimizer: [
				new CssMinimizerPlugin(),
				new TerserPlugin({
					terserOptions: {
						compress: {
							drop_console: true,
							drop_debugger: true,
							passes: 2,
							pure_funcs: ['console.info', 'console.debug'],
						},
						mangle: true,
						output: {
							comments: false,
						},
					},
					extractComments: false,
					parallel: true,
				}),
			],
			splitChunks: {
				cacheGroups: {
					vendor: {
						test: /[\\/]node_modules[\\/]/,
						name: 'vendors',
						chunks: 'all',
					},
				},
			},
			runtimeChunk: 'single',
		},
		plugins: [
			new HtmlWebpackPlugin({
				template: './src/index.html',
				filename: '../index.html',
				minify: isProduction ? {
					collapseWhitespace: true,
					removeComments: true,
					removeRedundantAttributes: true,
					useShortDoctype: true,
					removeEmptyAttributes: true,
					removeStyleLinkTypeAttributes: true,
					keepClosingSlash: true,
					minifyJS: true,
					minifyCSS: true,
				} : false,
			}),
			new MiniCssExtractPlugin({
				filename: isProduction ? '[name].[contenthash].css' : '[name].css',
			}),
			new CleanWebpackPlugin(),
		],
		stats: {
			warnings: false,
		},
		performance: {
			hints: isProduction ? 'warning' : false,
		},
	};
};