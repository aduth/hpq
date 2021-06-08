import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';

export default [
	{
		input: 'src/index.js',
		output: {
			format: 'umd',
			name: 'hpq',
			file: 'dist/hpq.js',
		},
		plugins: [
			babel({
				exclude: 'node_modules/**',
			}),
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
			babel({
				exclude: 'node_modules/**',
			}),
			terser(),
		],
	},
];
