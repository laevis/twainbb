# shortstop-resolve
[![Build Status](https://img.shields.io/travis/jasisk/shortstop-resolve.svg?style=flat)](https://travis-ci.org/jasisk/shortstop-resolve)

Adds resolve support to [shortstop](https://github.com/krakenjs/shortstop).

## Example
``` js
'use strict';

var shortstop = require('shortstop');
var resolver = shortstop.create();
var assert = require('assert');

var resolve = require('shortstop-resolve');

resolver.use('resolve', resolve(__dirname));

var data = {
  'dependency-image': 'resolve:dependency/image.png'
};

resolver.resolve(data, function (err, result) {
  assert.equal(result['dependency-image'], '/path/to/my/code/node_modules/dependency/image.png');
});
```
