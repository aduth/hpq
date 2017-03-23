(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.hpq = global.hpq || {})));
}(this, (function (exports) { 'use strict';

function parse(source, matchers) {
	if (!matchers) {
		return;
	}

	if ('string' === typeof source) {
		var doc = document.implementation.createHTMLDocument('');
		doc.body.innerHTML = source;
		source = doc.body;
	}

	if ('function' === typeof matchers) {
		return matchers(source);
	}

	if (Object !== matchers.constructor) {
		return;
	}

	return Object.keys(matchers).reduce(function (memo, key) {
		memo[key] = parse(source, matchers[key]);
		return memo;
	}, {});
}

function attr(selector, name) {
	return function (node) {
		var match = node.querySelector(selector);
		if (match && match.hasAttribute(name)) {
			return match.getAttribute(name);
		}
	};
}

function prop(selector, name) {
	return function (node) {
		var match = node;
		if (selector) {
			match = match.querySelector(selector);
		}

		if (match) {
			return match[name];
		}
	};
}

function html(selector) {
	return prop(selector, 'innerHTML');
}

function text(selector) {
	return prop(selector, 'textContent');
}

function query(selector, matchers) {
	return function (node) {
		var matches = node.querySelectorAll(selector);
		return [].map.call(matches, function (match) {
			return parse(match, matchers);
		});
	};
}

exports.parse = parse;
exports.attr = attr;
exports.prop = prop;
exports.html = html;
exports.text = text;
exports.query = query;

Object.defineProperty(exports, '__esModule', { value: true });

})));
