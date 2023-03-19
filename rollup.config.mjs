import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default [
	{
		input: 'src/index.ts',
		output: {
			format: 'umd',
			name: 'hpq',
			file: 'dist/hpq.js',
		},
		plugins: [
			nodeResolve({
				extensions: ['.ts'],
			}),
			babel({
				extensions: ['.ts'],
				babelHelpers: 'bundled',
				exclude: 'node_modules/**',
				presets: ['@babel/preset-typescript'],
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
			nodeResolve({
				extensions: ['.ts'],
			}),
			babel({
				extensions: ['.ts'],
				babelHelpers: 'bundled',
				exclude: 'node_modules/**',
				presets: ['@babel/preset-typescript'],
			}),
			terser(),
		],
	},
];
