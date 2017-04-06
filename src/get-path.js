/**
 * Given object and string of dot-delimited path segments, returns value at
 * path or undefined if path cannot be resolved.
 *
 * @param  {Object} object Lookup object
 * @param  {string} path   Path to resolve
 * @return {?*}            Resolved value
 */
export default function getPath( object, path ) {
	const segments = path.split( '.' );

	let segment;
	while ( ( segment = segments.shift() ) ) {
		if ( ! ( segment in object ) ) {
			return;
		}

		object = object[ segment ];
	}

	return object;
}
