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
			replace( {
				"typeof document === 'undefined'": false,
				delimiters: [ '', '' ],
			} ),
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
			replace( {
				"typeof document === 'undefined'": false,
				delimiters: [ '', '' ],
			} ),
			uglify,
		],
	},
];
