// This is checked-in to source control include manual revisions documenting overloaded functions,
// due to a suspected upstream bug in TypeScript.
//
// See: https://github.com/microsoft/TypeScript/issues/53350
//
// It is not generated automatically as part of the build process, and must be created manually
// using `npm run build:types`.

/**
 * Given a markup string or DOM element, creates an object aligning with the
 * shape of the matchers object, or the value returned by the matcher.
 *
 * @template T
 * @template {MatcherObj<T>} O
 *
 * @overload
 * @param {Element|string} source Source content
 * @param {O} matchers Object of matchers
 * @return {{[K in keyof O]: ReturnType<O[K]>}} Matched values, shaped by object
 */
export function parse<T extends unknown, O extends Record<string, MatcherFn<T>>>(
	source: Element | string,
	matchers: O
): { [K in keyof O]: ReturnType<O[K]> };

/**
 * Given a markup string or DOM element, creates an object aligning with the
 * shape of the matchers object, or the value returned by the matcher.
 *
 * @template {any} T
 * @template {MatcherFn<T>} F
 *
 * @overload
 * @param {Element|string} source Source content
 * @param {F} matchers matcher Matcher function
 * @return {ReturnType<F>} Matched value
 */
export function parse<T extends unknown, F extends MatcherFn<T>>(
	source: Element | string,
	matchers: F
): ReturnType<F>;

/**
 * Generates a function which matches node of type selector, returning an
 * attribute by property if the attribute exists. If no selector is passed,
 * returns property of the query element.
 *
 * @template T
 *
 * @overload
 * @param {string} name Property name
 * @return {MatcherFn<T>} Matcher function returning the property value
 */
export function prop<T>(name: string): MatcherFn<T>;

/**
 * Generates a function which matches node of type selector, returning an
 * attribute by property if the attribute exists. If no selector is passed,
 * returns property of the query element.
 *
 * @template T
 *
 * @overload
 * @param {string|undefined} selector Optional selector
 * @param {string} name Property name
 * @return {MatcherFn<T>} Matcher function returning the property value
 */
export function prop<T>(selector: string | undefined, name: string): MatcherFn<T>;

/**
 * Generates a function which matches node of type selector, returning an
 * attribute by name if the attribute exists. If no selector is passed,
 * returns attribute of the query element.
 *
 * @overload
 * @param {string} name Attribute name
 * @return {MatcherFn<string>} Matcher function returning the attribute value
 */
export function attr(name: string): MatcherFn<string>;

/**
 * Generates a function which matches node of type selector, returning an
 * attribute by name if the attribute exists. If no selector is passed,
 * returns attribute of the query element.
 *
 * @overload
 * @param {string|undefined} selector Optional selector
 * @param {string} name Attribute name
 * @return {MatcherFn<string>} Matcher function returning the attribute value
 */
export function attr(selector: string | undefined, name: string): MatcherFn<string>;

/**
 * Convenience for `prop( selector, 'innerHTML' )`.
 *
 * @see prop()
 *
 * @param {string=} selector Optional selector
 * @return {(node: Element) => string} Matcher which returns innerHTML
 */
export function html(selector?: string | undefined): (node: Element) => string;
/**
 * Convenience for `prop( selector, 'textContent' )`.
 *
 * @see prop()
 *
 * @param {string} selector Optional selector
 * @return {(node: Element) => string} Matcher which returns text content
 */
export function text(selector: string): (node: Element) => string;
/**
 * Creates a new matching context by first finding elements matching selector
 * using querySelectorAll before then running another `parse` on `matchers`
 * scoped to the matched elements.
 *
 * @see parse()
 *
 * @template T
 *
 * @param {string} selector Selector to match
 * @param {Matcher<T>} matchers Matcher function or object of matchers
 * @return Matcher function which returns an array of matched value(s)
 */
export function query<T>(selector: string, matchers: Matcher<T>): (node: Element) => any[];
export type MatcherFn<T> = (node: Element) => T;
export type MatcherObj<T> = Record<string, MatcherFn<T>>;
export type Matcher<T> = MatcherFn<T> | MatcherObj<T>;
