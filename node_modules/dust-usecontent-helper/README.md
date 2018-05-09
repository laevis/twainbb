dust-usecontent-helper
======================

A dustjs helper to load content bundles into the context for use by the [@message helper] or the [formatjs message helper].

Lead Maintainer: [Aria Stewart]

[![Build Status]][travis]

Example use
-----------

```
var dustjs = require('dustjs-linkedin');
var helper = require('dustjs-usecontent-helper');
var messagehelper = require('dustjs-message-helper');
helper(function (context, bundleName, cb) {
    if (bundleName == 'test.properties') {
        cb(null, {hello: "world"});
    } else {
        cb(new Error("not found"));
    }
}).registerWith(dustjs);
messagehelper.registerWith(dustjs);

dustjs.render('sometemplate', {}, function (err, result) {
    console.log(err, result);
});
```

And a template like this

```
{@useContent bundle="test.properties"}
    {@message key="hello" /}
{/useContent}
```

should return the string `"world"`

[@message helper]: https://github.com/krakenjs/dust-message-helper
[formatjs message helper]: http://formatjs.io/dust/
[Aria Stewart]: https://github.com/aredridel
[travis]: https://travis-ci.org/krakenjs/dust-usecontent-helper
[Build Status]: https://travis-ci.org/krakenjs/dust-usecontent-helper.svg?branch=master
