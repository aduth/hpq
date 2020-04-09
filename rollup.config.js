import babel from 'rollup-plugin-babel';
import replace from '@rollup/plugin-replace';
import uglify from 'rollup-plugin-uglify';

export default [
	{
		input: 'src/index.js',
		output: {
			format: 'umd',
			name: 'hpq',
			file: 'dist/hpq.js',
		},
		plugins: [
			babel( {
				exclude: 'node_modules/**',
			} ),
			replace( { 'process.browser': true } ),
		],
	},
	{
		input: 'src/index.js',
		output: {
			format: 'umd',
			name: 'hpq',
			file: 'dist/hpq.node.js',
		},
		plugins: [
			babel( {
				exclude: 'node_modules/**',
			} ),
			replace( { 'process.browser': false } ),
		],
	},
	{
		input: 'src/index.js',
		output: {
			format: 'umd',
			name: 'hpq',
			file: 'dist/hpq.min.js',
		},
		plugins: [
			babel( {
				exclude: 'node_modules/**',
			} ),
			replace( { 'process.browser': true } ),
			uglify,
		],
	},
];
