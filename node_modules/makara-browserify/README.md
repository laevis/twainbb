makara-browserify
=================

i18n transport for browserify-based apps served by Kraken.js

Use
---

`var mb = require('makara-browserify');`

`mb.build(projectRoot, cb)`: Builds browserify requireable bundles exposing `_languagepack` for each locale in `projectRoot/locales`

`mb.languagePackPath(locale)`: returns the path relative to the `projectRoot/.build/` of the compiled assets, suitable for tacking onto the end of a CDN root or static server root for use in applications. Locale may be a string or a `bcp47` style locale object, or a simple object with a `language` and `country` property.

`mb.middleware()` returns an Express middleware that sets `res.locals.languagePackPath` to the appropriate path relative to the built file root to be served. This requires `res.locals.locale` to be set appropriately, as in the [express-bcp47](https://github.com/krakenjs/express-bcp47) module.
