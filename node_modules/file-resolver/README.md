file-resolver
=============

Lead Maintainer: [Aria Stewart](https://github.com/aredridel)  

[![Build Status](https://travis-ci.org/krakenjs/file-resolver.svg?branch=master)](https://travis-ci.org/krakenjs/file-resolver)

Used in kraken based projects for resolving file paths when given the locale, source file name, and the file extension.

Simple Usage:

```javascript
var fr = require('fileResolver'),
    resolver = fr.create({root: 'path/to/templates', fallback: 'en_US', ext: 'dust'}),
    fileInfo = resolver.resolve('foo', 'es_ES');

//fileInfo = {
//  root: 'path/to/templates/ES/es',
//  file: 'path/to/templates/ES/es/foo.dust',
//  ext: 'dust',
//  name: 'foo'
//}
```

Running Tests:

```
To Run tests
$npm test

To Run Coverage
$npm run-script cover

To Run linting
$npm run-script lint
```
