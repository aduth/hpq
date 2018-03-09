(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.hpq = global.hpq || {})));
}(this, (function (exports) { 'use strict';

/**
 * Given object and string of dot-delimited path segments, returns value at
 * path or undefined if path cannot be resolved.
 *
 * @param  {Object} object Lookup object
 * @param  {string} path   Path to resolve
 * @return {?*}            Resolved value
 */
function getPath(object, path) {
	var segments = path.split('.');

	var segment = void 0;
	while (segment = segments.shift()) {
		if (!(segment in object)) {
			return;
		}

		object = object[segment];
	}

	return object;
}

/**
 * Internal dependencies
 */
/**
 * Given a markup string or DOM element, creates an object aligning with the
 * shape of the matchers object, or the value returned by the matcher.
 *
 * @param  {(string|Element)}  source   Source content
 * @param  {(Object|Function)} matchers Matcher function or object of matchers
 * @return {(Object|*)}                 Matched value(s), shaped by object
 */
function parse(source, matchers) {
	if (!matchers) {
		return;
	}

	// Coerce to element
	if ('string' === typeof source) {
		var doc = document.implementation.createHTMLDocument('');
		doc.body.innerHTML = source;
		source = doc.body.firstChild;
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
	return Object.keys(matchers).reduce(function (memo, key) {
		memo[key] = parse(source, matchers[key]);
		return memo;
	}, {});
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
function prop(selector, name) {
	if (1 === arguments.length) {
		name = selector;
		selector = undefined;
	}

	return function (node) {
		var match = node;
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
 * @param  {?string} selector Optional selector
 * @param  {string}  name     Attribute name
 * @return {?string}          Attribute value
 */
function attr(selector, name) {
	if (1 === arguments.length) {
		name = selector;
		selector = undefined;
	}

	return function (node) {
		var attributes = prop(selector, 'attributes')(node);
		if (attributes && attributes.hasOwnProperty(name)) {
			return attributes[name].value;
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
function html(selector) {
	return prop(selector, 'innerHTML');
}

/**
 * Convenience for `prop( selector, 'textContent' )`.
 *
 * @see prop()
 *
 * @param  {?string} selector Optional selector
 * @return {string}           Text content
 */
function text(selector) {
	return prop(selector, 'textContent');
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
function query(selector, matchers) {
	return function (node) {
		var matches = node.querySelectorAll(selector);
		return [].map.call(matches, function (match) {
			return parse(match, matchers);
		});
	};
}

exports.parse = parse;
exports.prop = prop;
exports.attr = attr;
exports.html = html;
exports.text = text;
exports.query = query;

Object.defineProperty(exports, '__esModule', { value: true });

})));
