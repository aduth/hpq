/**
 * Internal dependencies
 */
import getPath from './get-path';

export type MatcherFn<T = any> = (node: Element) => T | undefined;

export type MatcherObj = { [key: string]: MatcherObj | MatcherFn };

export type MatcherObjResult<F extends MatcherFn, O extends MatcherObj> = {
	[K in keyof O]: O[K] extends F
		? ReturnType<O[K]>
		: O[K] extends MatcherObj
		? MatcherObjResult<F, O[K]>
		: never;
};

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
 * @param source Source content
 * @param matchers Matcher function or object of matchers
 */
export function parse(source: string | Element, matchers?: undefined): undefined;

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
	if (typeof matchers === 'function') {
		return matchers(source);
	}

	// Bail if we can't handle matchers
	if (Object !== matchers.constructor) {
		return;
	}

	// Shape result by matcher object
	return Object.keys(matchers).reduce((memo, key: keyof MatcherObjResult<F, O>) => {
		const inner = matchers[key];
		memo[key] = parse(source, inner);
		return memo;
	}, {} as MatcherObjResult<F, O>);
}

/**
 * Generates a function which matches node of type selector, returning an
 * attribute by property if the attribute exists. If no selector is passed,
 * returns property of the query element.
 *
 * @param name Property name
 * @return Property value
 */
export function prop<N extends keyof Element>(name: string): MatcherFn<Element[N]>;

/**
 * Generates a function which matches node of type selector, returning an
 * attribute by property if the attribute exists. If no selector is passed,
 * returns property of the query element.
 *
 * @param selector Optional selector
 * @param name Property name
 * @return Property value
 */
export function prop<N extends keyof Element>(
	selector: string | undefined,
	name: N
): MatcherFn<Element[N]>;

/**
 * Generates a function which matches node of type selector, returning an
 * attribute by property if the attribute exists. If no selector is passed,
 * returns property of the query element.
 *
 * @param selector Optional selector
 * @param name Property name
 * @return Property value
 */
export function prop<N extends keyof Element>(
	arg1: string | undefined,
	arg2?: string
): MatcherFn<Element[N]> {
	let name: string;
	let selector: string | undefined;
	if (1 === arguments.length) {
		name = arg1 as string;
		selector = undefined;
	} else {
		name = arg2 as string;
		selector = arg1;
	}
	return function (node: Element): Element[N] | undefined {
		let match: Element | null = node;
		if (selector) {
			match = node.querySelector(selector);
		}
		if (match) {
			return getPath(match, name);
		}
	} as MatcherFn<Element[N]>;
}

/**
 * Generates a function which matches node of type selector, returning an
 * attribute by name if the attribute exists. If no selector is passed,
 * returns attribute of the query element.
 *
 * @param name Attribute name
 * @return Attribute value
 */
export function attr(name: string): MatcherFn<string>;

/**
 * Generates a function which matches node of type selector, returning an
 * attribute by name if the attribute exists. If no selector is passed,
 * returns attribute of the query element.
 *
 * @param selector Optional selector
 * @param name Attribute name
 * @return Attribute value
 */
export function attr(selector: string | undefined, name: string): MatcherFn<string>;

/**
 * Generates a function which matches node of type selector, returning an
 * attribute by name if the attribute exists. If no selector is passed,
 * returns attribute of the query element.
 *
 * @param selector Optional selector
 * @param name Attribute name
 * @return Attribute value
 */
export function attr(arg1: string | undefined, arg2?: string): MatcherFn<string> {
	let name: string;
	let selector: string | undefined;
	if (1 === arguments.length) {
		name = arg1 as string;
		selector = undefined;
	} else {
		name = arg2 as string;
		selector = arg1;
	}
	return function (node: Element): string | undefined {
		const attributes = prop(selector, 'attributes')(node);
		if (attributes && Object.prototype.hasOwnProperty.call(attributes, name)) {
			return attributes[name as any].value;
		}
	};
}

/**
 * Convenience for `prop( selector, 'innerHTML' )`.
 *
 * @see prop()
 *
 * @param selector Optional selector
 * @return Inner HTML
 */
export function html(selector?: string) {
	return prop(selector, 'innerHTML') as MatcherFn<string>;
}

/**
 * Convenience for `prop( selector, 'textContent' )`.
 *
 * @see prop()
 *
 * @param selector Optional selector
 * @return Text content
 */
export function text(selector?: string) {
	return prop(selector, 'textContent') as MatcherFn<string>;
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
 * @return Matcher function which returns an array of matched value(s)
 */
export function query<F extends MatcherFn, O extends MatcherObj>(
	selector: string,
	matchers?: F | O
): MatcherFn<MatcherObjResult<F, O>[]> {
	return function (node: Element) {
		const matches = node.querySelectorAll(selector);
		return [].map.call(matches, (match) => parse(match, matchers!)) as MatcherObjResult<F, O>[];
	};
}
