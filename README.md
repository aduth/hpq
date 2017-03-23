# hpq

A utility to parse and query HTML into an object shape.

## Example

```js
hpq.parse( '<figure><img src="img.png" alt="Image"><figcaption>An Image</figcaption></figure>', {
	src: hpq.attr( 'img', 'src' ),
	alt: hpq.attr( 'img', 'alt' ),
	caption: hpq.text( 'figcaption' )
} );

// { text: [ "...", "..." ], cite: "Andrew" }

hpq.parse( '<blockquote><p>...</p><p>...</p><cite>Andrew</cite></blockquote>', {
	text: hpq.query( 'p', hpq.text() ),
	cite: hpq.text( 'cite' )
} );

// { src: "img.png", alt: "Image", caption: "An Image" }
```

## Getting Started

_WIP_

## API

_WIP_

## License

Copyright (c) 2017 Andrew Duthie

[The MIT License (MIT)](https://opensource.org/licenses/MIT)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
