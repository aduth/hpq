/**
 * External dependencies
 */
import babel from 'rollup-plugin-babel';

export default {
	entry: 'src/index.js',
	format: 'umd',
	moduleName: 'hpq',
	plugins: [
		babel( {
			exclude: 'node_modules/**'
		} )
	],
	dest: 'dist/hpq.js'
};
