/**
 * Given a markup string or DOM element, creates an object aligning with the
 * shape of the matchers object, or the value returned by the matcher.
 *
 * @param  {(string|Element)}  source   Source content
 * @param  {(Object|Function)} matchers Matcher function or object of matchers
 * @return {(Object|*)}                 Matched value(s), shaped by object
 */
export function parse( source, matchers ) {
	if ( ! matchers ) {
		return;
	}

	// Coerce to element
	if ( 'string' === typeof source ) {
		const doc = document.implementation.createHTMLDocument( '' );
		doc.body.innerHTML = source;
		source = doc.body;
	}

	// Return singular value
	if ( 'function' === typeof matchers ) {
		return matchers( source );
	}

	// Bail if we can't handle matchers
	if ( Object !== matchers.constructor ) {
		return;
	}

	// Shape result by matcher object
	return Object.keys( matchers ).reduce( ( memo, key ) => {
		memo[ key ] = parse( source, matchers[ key ] );
		return memo;
	}, {} );
}

/**
 * Generates a function which matches and returns the first node of type
 * selector in the element, or the query element itself if no selector is
 * passed.
 *
 * @param  {?string}  selector Optional selector
 * @return {?Element}          Found element
 */
export function find( selector ) {
	return function( node ) {
		if ( ! selector ) {
			return node;
		}

		return node.querySelector( selector );
	};
}

/**
 * Generates a function which matches node of type selector, returning an
 * attribute by name if the attribute exists. If no selector is passed,
 * returns attribute of the query element.
 *
 * @param  {?string} selector Optional selector
 * @param  {string}  name     Attribute name
 * @return {?string}          Attribute value
 */
export function attr( selector, name ) {
	return function( node ) {
		const match = find( selector )( node );
		if ( match && match.hasAttribute( name ) ) {
			return match.getAttribute( name );
		}
	};
}

/**
 * Generates a function which matches node of type selector, returning an
 * attribute by property if the attribute exists. If no selector is passed,
 * returns property of the query element.
 *
 * @param  {?string} selector Optional selector
 * @param  {string}  name     Property name
 * @return {*}                Property value
 */
export function prop( selector, name ) {
	return function( node ) {
		const match = find( selector )( node );
		if ( match ) {
			return match[ name ];
		}
	};
}

/**
 * Convenience for `prop( selector, 'innerHTML' )`.
 *
 * @see prop()
 *
 * @param  {?string} selector Optional selector
 * @return {string}           Inner HTML
 */
export function html( selector ) {
	return prop( selector, 'innerHTML' );
}

/**
 * Convenience for `prop( selector, 'textContent' )`.
 *
 * @see prop()
 *
 * @param  {?string} selector Optional selector
 * @return {string}           Text content
 */
export function text( selector ) {
	return prop( selector, 'textContent' );
}

/**
 * Creates a new matching context by first finding elements matching selector
 * using querySelectorAll before then running another `parse` on `matchers`
 * scoped to the matched elements.
 *
 * @see parse()
 *
 * @param  {string}            selector Selector to match
 * @param  {(Object|Function)} matchers Matcher function or object of matchers
 * @return {Array.<*,Object>}           Array of matched value(s)
 */
export function query( selector, matchers ) {
	return function( node ) {
		const matches = node.querySelectorAll( selector );
		return [].map.call( matches, ( match ) => parse( match, matchers ) );
	};
}
