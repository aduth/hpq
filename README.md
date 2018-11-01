# hpq

A utility to parse and query HTML into an object shape. Heavily inspired by [gdom](https://github.com/syrusakbary/gdom).

[Try the Explorer Demo](https://aduth.github.io/hpq/)

[![Build Status](https://travis-ci.org/aduth/hpq.svg?branch=master)](https://travis-ci.org/aduth/hpq)

## Example

```js
hpq.parse( '<figure><img src="img.png" alt="Image"><figcaption>An Image</figcaption></figure>', {
	src: hpq.attr( 'img', 'src' ),
	alt: hpq.attr( 'img', 'alt' ),
	caption: hpq.text( 'figcaption' )
} );

// { src: "img.png", alt: "Image", caption: "An Image" }

hpq.parse( '<blockquote><p>...</p><p>...</p><cite>Andrew</cite></blockquote>', {
	text: hpq.query( 'p', hpq.text() ),
	cite: hpq.text( 'cite' )
} );

// { text: [ "...", "..." ], cite: "Andrew" }
```

## Getting Started

[Download the generated script file](https://unpkg.com/hpq/dist/hpq.min.js) or install via NPM if you have a front-end build process:

```
npm install hpq
```

`hpq` assumes that it's being run in a browser environment. If you need to simulate this in Node, consider [jsdom](https://www.npmjs.com/package/jsdom).

## Usage

Pass a markup string or DOM element to the top-level `parse` function, along with the object shape you'd like to match. Keys of the matcher object will align with the returned object shape, where values are matcher functions; one of the many included matchers or your own accepting the node under test.

## API

`parse( source: string | Element, matchers: Object | Function ): Object | mixed`

Given a markup string or DOM element, creates an object aligning with the shape of the `matchers` object, or the value returned by the matcher function.  If `matchers` is an object, its keys are the desired parameter names and its values are matcher functions that will each extract the value of their desired parameter.

Matcher functions accept a single parameter `node` (a DOM element) and return the requested value.

`attr( selector: ?string, name: string ): Function`

Generates a function which matches node of type selector, returning an attribute by name if the attribute exists. If no selector is passed, returns attribute of the query element.

`prop( selector: ?string, name: string ): Function`

Generates a function which matches node of type selector, returning an attribute by property if the attribute exists. If no selector is passed, returns property of the query element.

`html( selector: ?string ): Function`

Convenience for `prop( selector, 'innerHTML' )` .

`text( selector: ?string ): Function`

Convenience for `prop( selector, 'textContent' )` .

`query( selector: string, matchers: Object | Function )`

Creates a new matching context by first finding elements matching selector using [`querySelectorAll`](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll) before then running another `parse` on `matchers` scoped to the matched elements.

## License

Copyright (c) 2018 Andrew Duthie

[The MIT License (MIT)](https://opensource.org/licenses/MIT)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
