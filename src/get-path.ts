/**
 * Given object and string of dot-delimited path segments, returns value at
 * path or undefined if path cannot be resolved.
 *
 * @param object Lookup object
 * @param path   Path to resolve
 * @return       Resolved value
 */
export default function getPath(object: Record<string, any>, path: string): any | undefined {
	const segments = path.split('.');

	let segment;
	while ((segment = segments.shift())) {
		if (!(segment in object)) {
			return;
		}

		object = object[segment];
	}

	return object;
}
