/**
 * Internal dependencies
 */
import getPath from './get-path';

/**
 * Function returning a DOM document created by `createHTMLDocument`. The same
 * document is returned between invocations.
 *
 * @return DOM document.
 */
const getDocument = (() => {
	let doc: Document;
	return (): Document => {
		if (!doc) {
			doc = document.implementation.createHTMLDocument('');
		}

		return doc;
	};
})();

type MatcherFn<R = any> = (node: Element) => R;

type MatcherObj = { [x: string]: MatcherObj | MatcherFn };

type MatcherObjResult<F extends MatcherFn, O extends MatcherObj> = {
	[K in keyof O]: O[K] extends F
		? ReturnType<O[K]>
		: O[K] extends MatcherObj
		? MatcherObjResult<F, O[K]>
		: never;
};

/**
 * Given a markup string or DOM element, creates an object aligning with the
 * shape of the matchers object, or the value returned by the matcher.
 *
 * @param source Source content
 * @param matchers Object of matchers
 * @return Matched values, shaped by object
 */
export function parse<F extends MatcherFn, O extends MatcherObj>(
	source: string | Element,
	matchers: O
): MatcherObjResult<F, O>;

/**
 * Given a markup string or DOM element, creates an object aligning with the
 * shape of the matchers object, or the value returned by the matcher.
 *
 * @param source Source content
 * @param matcher Matcher function
 * @return Matched value
 */
export function parse<F extends MatcherFn>(source: string | Element, matchers: F): ReturnType<F>;

/**
 * Given a markup string or DOM element, creates an object aligning with the
 * shape of the matchers object, or the value returned by the matcher.
 *
 * @param source Source content
 * @param matchers Matcher function or object of matchers
 */
export function parse<F extends MatcherFn, O extends MatcherObj>(
	source: string | Element,
	matchers: O | F
): MatcherObjResult<F, O> | ReturnType<F>;

/**
 * Given a markup string or DOM element, creates an object aligning with the
 * shape of the matchers object, or the value returned by the matcher.
 *
 * @param source Source content
 * @param matchers Matcher function or object of matchers
 */
export function parse(source: string | Element, matchers?: undefined): undefined;

/**
 * Given a markup string or DOM element, creates an object aligning with the
 * shape of the matchers object, or the value returned by the matcher.
 *
 * @param source Source content
 * @param matchers Matcher function or object of matchers
 */
export function parse<F extends MatcherFn, O extends MatcherObj>(
	source: string | Element,
	matchers?: O | F
) {
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
	return Object.keys(matchers).reduce((memo: MatcherObj, key) => {
		const inner = matchers[key];
		memo[key] = parse(source, inner);
		return memo;
	}, {});
}

/**
 * Generates a function which matches node of type selector, returning an
 * attribute by property if the attribute exists. If no selector is passed,
 * returns property of the query element.
 *
 * @param selector Optional selector
 * @param name Property name
 * @return Matcher function returning the property value
 */
export function prop<N extends keyof Element>(selector?: string, name?: N): MatcherFn<Element[N]> {
	if (1 === arguments.length) {
		name = selector as N;
		selector = undefined;
	}

	return function (node) {
		let match: Element | null = node;
		if (selector) {
			match = node.querySelector(selector);
		}

		if (match) {
			return getPath(match, name!);
		}
	};
}

/**
 * Generates a function which matches node of type selector, returning an
 * attribute by name if the attribute exists. If no selector is passed,
 * returns attribute of the query element.
 *
 * @param selector Optional selector
 * @param name Attribute name
 * @return Matcher function returning the attribute value
 */
export function attr(selector?: string, name?: string): MatcherFn<string | undefined> {
	if (1 === arguments.length) {
		name = selector;
		selector = undefined;
	}

	return function (node) {
		const attributes = prop(selector, 'attributes')(node);
		if (attributes && Object.prototype.hasOwnProperty.call(attributes, name!)) {
			return attributes.getNamedItem(name!)!.value;
		}
	};
}

/**
 * Convenience for `prop( selector, 'innerHTML' )`.
 *
 * @see prop()
 *
 * @param selector Optional selector
 * @return Matcher which returns innerHTML
 */
export function html(selector?: string): MatcherFn<string> {
	return prop(selector, 'innerHTML') as MatcherFn<string>;
}

/**
 * Convenience for `prop( selector, 'textContent' )`.
 *
 * @see prop()
 *
 * @param selector Optional selector
 * @return Matcher which returns text content
 */
export function text(selector?: string): MatcherFn<string> {
	return prop(selector, 'textContent') as MatcherFn<string>;
}

/**
 * Creates a new matching context by first finding elements matching selector
 * using querySelectorAll before then running another `parse` on `matchers`
 * scoped to the matched elements.
 *
 * @see parse()
 *
 * @param {string} selector Selector to match
 * @param {Matcher<T>} matchers Matcher function or object of matchers
 * @return Matcher function which returns an array of matched value(s)
 */
export function query<F extends MatcherFn, O extends MatcherObj>(
	selector: string,
	matchers?: F | O
): MatcherFn<MatcherObjResult<F, O>[]> {
	return function (node) {
		const matches = node.querySelectorAll(selector);
		return [].map.call(matches, (match) => parse(match, matchers!)) as MatcherObjResult<F, O>[];
	};
}
