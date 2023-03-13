/**
 * Internal dependencies
 */
import getPath from './get-path';

type MatcherFn<T = any> = (node: Element) => T;
type MatcherObj = Record<string, MatcherFn>;
type Matcher = MatcherFn | MatcherObj;

/**
 * Function returning a DOM document created by `createHTMLDocument`. The same
 * document is returned between invocations.
 *
 * @return DOM document.
 */
const getDocument = (() => {
	let doc: Document | undefined;
	return () => {
		if (!doc) {
			doc = document.implementation.createHTMLDocument('');
		}

		return doc;
	};
})();

/**
 * Given a markup string or DOM element, creates an object aligning with the
 * shape of the matchers object, or the value returned by the matcher.
 *
 * @param source   Source content
 * @param matchers Matcher function or object of matchers
 * @return         Matched value(s), shaped by object
 */
export function parse(source: string | Element, matchers: Matcher): any {
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
		return matchers(source);
	}

	// Bail if we can't handle matchers
	if (Object !== matchers.constructor) {
		return;
	}

	// Shape result by matcher object
	return Object.keys(matchers).reduce((memo, key) => {
		memo[key] = parse(source, matchers[key]);
		return memo;
	}, {} as Record<string, any>);
}

/**
 * Generates a function which matches node of type selector, returning an
 * attribute by property if the attribute exists. If no selector is passed,
 * returns property of the query element.
 *
 * @param selector Optional selector
 * @param name     Property name
 * @return         Property value
 */
export function prop(name: string): MatcherFn;
export function prop(selector: string | undefined, name: string): MatcherFn;
export function prop(arg1: string | undefined, arg2?: string): MatcherFn {
	let name: string;
	let selector: string | undefined;
	if (1 === arguments.length) {
		name = arg1 as string;
		selector = undefined;
	} else {
		name = arg2 as string;
		selector = arg1;
	}
	return function (node: Element) {
		let match: Element | null = node;
		if (selector) {
			match = node.querySelector(selector);
		}
		if (match) {
			return getPath(match, name);
		}
	};
}

/**
 * Generates a function which matches node of type selector, returning an
 * attribute by name if the attribute exists. If no selector is passed,
 * returns attribute of the query element.
 *
 * @param selector Optional selector
 * @param name     Attribute name
 * @return         Attribute value
 */
export function attr(name: string): MatcherFn;
export function attr(selector: string | undefined, name: string): MatcherFn;
export function attr(arg1: string | undefined, arg2?: string): MatcherFn {
	let name: string;
	let selector: string | undefined;
	if (1 === arguments.length) {
		name = arg1 as string;
		selector = undefined;
	} else {
		name = arg2 as string;
		selector = arg1;
	}
	return function (node: Element): unknown {
		const attributes = prop(selector, 'attributes')(node);
		if (attributes && Object.prototype.hasOwnProperty.call(attributes, name)) {
			return attributes[name].value;
		}
	};
}

/**
 * Convenience for `prop( selector, 'innerHTML' )`.
 *
 * @see prop()
 *
 * @param selector Optional selector
 * @return         Inner HTML
 */
export function html(selector?: string) {
	return prop(selector, 'innerHTML');
}

/**
 * Convenience for `prop( selector, 'textContent' )`.
 *
 * @see prop()
 *
 * @param  selector Optional selector
 * @return          Text content
 */
export function text(selector?: string) {
	return prop(selector, 'textContent');
}

/**
 * Creates a new matching context by first finding elements matching selector
 * using querySelectorAll before then running another `parse` on `matchers`
 * scoped to the matched elements.
 *
 * @see parse()
 *
 * @param selector Selector to match
 * @param matchers Matcher function or object of matchers
 * @return         Matcher function which returns an array of matched value(s)
 */
export function query(selector: string, matchers: Matcher) {
	return function (node: Element): any[] {
		const matches = node.querySelectorAll(selector);
		return [].map.call(matches, (match) => parse(match, matchers));
	};
}
