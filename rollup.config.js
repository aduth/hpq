import babel from 'rollup-plugin-babel';
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
			uglify,
		],
	},
];
