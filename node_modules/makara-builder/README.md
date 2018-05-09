# makara-builder

Lead Maintainer: [Matt Edelman](https://github.com/grawk)

[![Build Status](https://travis-ci.org/krakenjs/makara-builder.svg?branch=master)](https://travis-ci.org/krakenjs/makara-builder)

Identify all locales under a given directory and call a passed in "writer" for each one

## API

`module.exports = function build(appRoot, writer, cb) {`

- `appRoot {String}` filesystem directory where `locales` directory resides. Under that would be structure e.g. `US/en`, `XC/zh`
- `writer {Function}`
  - `localeRoot {String}` root output directory for the given locale
  - `@returns {Function}`
    - `locale {String}` locale string e.g. `DE-fr`
    - `cb {Function}` errback
- `cb {Function}` called with error or upon successful writing of all locales

`makara-builder` will use [spundle]() to convert all localized .properties files to JSON objects, 
create the target directory structure for built languagepack files, and then call the passed in `writer` for each locale.

The `writer` will wrap the JSON output as necessary, and write the languagepack file to `localeRoot`.
An example of a `writer` function is that found in [makara-amdify](https://github.com/krakenjs/makara-amdify):

```js
'use strict';

var path = require('path');
var fs = require('fs');

var wrap = function (out) {
	return 'define("_languagepack", function () { return ' + JSON.stringify(out) + '; });';
};

var writer = function (outputRoot, cb) {
	return function (out) {
		fs.writeFile(path.resolve(outputRoot, '_languagepack.js'), wrap(out), cb);
	};
};

module.exports = function build(root, cb) {
	require('makara-builder')(root, writer, cb);
};
```