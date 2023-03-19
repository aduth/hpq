import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';

export default [
	{
		input: 'src/index.ts',
		output: {
			format: 'umd',
			name: 'hpq',
			file: 'dist/hpq.js',
		},
		plugins: [
			resolve({ extensions: ['.ts'] }),
			babel({
				extensions: ['.ts'],
				babelHelpers: 'bundled',
				exclude: 'node_modules/**',
			}),
		],
	},
	{
		input: 'src/index.ts',
		output: {
			format: 'umd',
			name: 'hpq',
			file: 'dist/hpq.min.js',
		},
		plugins: [
			resolve({ extensions: ['.ts'] }),
			babel({
				extensions: ['.ts'],
				babelHelpers: 'bundled',
				exclude: 'node_modules/**',
			}),
			terser(),
		],
	},
];
