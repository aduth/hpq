/**
 * Internal dependencies
 */
import getPath from './get-path';

/**
 * Function returning a DOM document created by `createHTMLDocument`. The same
 * document is returned between invocations.
 *
 * @return {Document} DOM document.
 */
const getDocument = (() => {
	/** @type {Document|null} */
	let doc;
	return () => {
		if (!doc) {
			doc = document.implementation.createHTMLDocument('');
		}

		return doc;
	};
})();

/**
 * @typedef {(node: Element) => any} MatcherFn
 * @typedef {Record<string, MatcherFn>} MatcherObj
 * @typedef {(MatcherFn|MatcherObj)} Matcher
 */

/**
 * Given a markup string or DOM element, creates an object aligning with the
 * shape of the matchers object, or the value returned by the matcher.
 *
 * @param  {string|Element} source   Source content
 * @param  {Matcher}        matchers Matcher function or object of matchers
 * @return {any}                     Matched value(s), shaped by object
 */
export function parse(source, matchers) {
	if (!matchers) {
		return;
	}

	// Coerce to element
	if ('string' === typeof source) {
		const doc = getDocument();
		doc.body.innerHTML = source;
		source = doc.body;
	}

	// Return singular value
	if ('function' === typeof matchers) {
		return matchers(/** @type {Element} */ (source));
	}

	// Bail if we can't handle matchers
	if (Object !== matchers.constructor) {
		return;
	}

	// Shape result by matcher object
	return Object.keys(matchers).reduce((memo, key) => {
		memo[key] = parse(source, matchers[key]);
		return memo;
	}, /** @type {Record<string, any>} */ ({}));
}

/**
 * Generates a function which matches node of type selector, returning an
 * attribute by property if the attribute exists. If no selector is passed,
 * returns property of the query element.
 *
 * @param  {string=}   selector Optional selector
 * @param  {string=}   name     Property name
 * @return {MatcherFn}          Matcher function returning the property value
 */
export function prop(selector, name) {
	if (1 === arguments.length) {
		name = selector;
		selector = undefined;
	}

	return function (node) {
		/** @type {Element|null} */
		let match = node;
		if (selector) {
			match = node.querySelector(selector);
		}

		if (match) {
			return getPath(match, /** @type {string} */ (name));
		}
	};
}

/**
 * Generates a function which matches node of type selector, returning an
 * attribute by name if the attribute exists. If no selector is passed,
 * returns attribute of the query element.
 *
 * @param  {string=}   selector Optional selector
 * @param  {string=}   name     Attribute name
 * @return {MatcherFn}          Matcher function returning the attribute value
 */
export function attr(selector, name) {
	if (1 === arguments.length) {
		name = selector;
		selector = undefined;
	}

	return function (node) {
		const attributes = prop(selector, 'attributes')(node);
		if (
			attributes &&
			Object.prototype.hasOwnProperty.call(attributes, /** @type {string} */ (name))
		) {
			return attributes[/** @type {string} */ (name)].value;
		}
	};
}

/**
 * Convenience for `prop( selector, 'innerHTML' )`.
 *
 * @see prop()
 *
 * @param  {string=}                   selector Optional selector
 * @return {(node: Element) => string}          Matcher which returns innerHTML
 */
export function html(selector) {
	return prop(selector, 'innerHTML');
}

/**
 * Convenience for `prop( selector, 'textContent' )`.
 *
 * @see prop()
 *
 * @param  {string}                    selector Optional selector
 * @return {(node: Element) => string}          Matcher which returns text content
 */
export function text(selector) {
	return prop(selector, 'textContent');
}

/**
 * Creates a new matching context by first finding elements matching selector
 * using querySelectorAll before then running another `parse` on `matchers`
 * scoped to the matched elements.
 *
 * @see parse()
 *
 * @param  {string}  selector Selector to match
 * @param  {Matcher} matchers Matcher function or object of matchers
 * @return                    Matcher function which returns an array of matched value(s)
 */
export function query(selector, matchers) {
	/** @type {(node: Element) => any[]} */
	return function (node) {
		const matches = node.querySelectorAll(selector);
		return [].map.call(matches, (match) => parse(match, matchers));
	};
}
