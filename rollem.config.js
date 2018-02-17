const config = {
	entry: 'src/index.js',
	format: 'umd',
	moduleName: 'hpq',
	plugins: [
		require( 'rollup-plugin-babel' )( {
			exclude: 'node_modules/**',
		} ),
	],
	dest: 'dist/hpq.js',
};

export default [
	config,
	Object.assign( {}, config, {
		plugins: config.plugins.concat( [
			require( 'rollup-plugin-uglify' )(),
		] ),
		dest: 'dist/hpq.min.js',
	} ),
];
