export function parse( source, matchers ) {
	if ( ! matchers ) {
		return;
	}

	if ( 'string' === typeof source ) {
		const doc = document.implementation.createHTMLDocument( '' );
		doc.body.innerHTML = source;
		source = doc.body;
	}

	if ( 'function' === typeof matchers ) {
		return matchers( source );
	}

	if ( Object !== matchers.constructor ) {
		return;
	}

	return Object.keys( matchers ).reduce( ( memo, key ) => {
		memo[ key ] = parse( source, matchers[ key ] );
		return memo;
	}, {} );
}

export function attr( selector, name ) {
	return function( node ) {
		const match = node.querySelector( selector );
		if ( match && match.hasAttribute( name ) ) {
			return match.getAttribute( name );
		}
	};
}

export function prop( selector, name ) {
	return function( node ) {
		let match = node;
		if ( selector ) {
			match = match.querySelector( selector );
		}

		if ( match ) {
			return match[ name ];
		}
	};
}

export function html( selector ) {
	return prop( selector, 'innerHTML' );
}

export function text( selector ) {
	return prop( selector, 'textContent' );
}

export function query( selector, matchers ) {
	return function( node ) {
		const matches = node.querySelectorAll( selector );
		return [].map.call( matches, ( match ) => parse( match, matchers ) );
	};
}
