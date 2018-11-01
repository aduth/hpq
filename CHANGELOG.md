## 1.3.0 (2018-10-31)

- Improvement: Improves performance of markup string parsing by ~4x.

## 1.2.0 (2017-04-06)

- Add: Support for deep path lookup on `prop` and `attr` (example: `prop( 'p', 'style.textAlign' )`)

## 1.1.1 (2017-03-24)

- Fix: `package.module` is now transpiled except ES2015 modules

## 1.1.0 (2017-03-23)

- New: Optional selector argument to attr, prop can be omitted. Optional initial arguments are an awkward syntax supported here for convenience's sake. This feature may be removed, or arguments reversed, in future major versions.
- General: Include minified distributable
- General: Added unit tests

## 1.0.1 (2017-03-23)

- Fix: Broken "main" `package.json` field
- General: Include repository details in `package.json`

## 1.0.0 (2017-03-23)

- Initial release
