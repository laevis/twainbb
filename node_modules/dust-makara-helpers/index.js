"use strict";
var spud = require('spud');
var iferr = require('iferr');
var VError = require('verror');
var debug = require('debuglog')('dust-makara-helpers');
var fs = require('fs');
var aproba = require('aproba');
var bcp47s = require('bcp47-stringify');

var common = require('./common');

module.exports = function(dust, options) {
    options = options || {};

    // We bind the loader for the useContent helper here to the express view
    // class's lookup method. It must be the express 5 style one, asynchronous,
    // and for internationalized lookups to work, it must be the backport and
    // extension provided by engine-munger.
    var loader = function(ctx, bundle, cb) {
        aproba('OSF', arguments);

        debug("content request for '%s'", bundle);

        if (!ctx.options || !ctx.options.view) {
            return cb(makeErr(ctx, bundle));
        }

        var locale = options.localeFromContext && options.localeFromContext(ctx) || localeFromContext(ctx);
        
        //stringify the locale in case a custom localeFromContext method returns a bcp47-style JSON object
        var cacheKey = bundle + '#' + JSON.stringify(locale);
        if (dust.config.cache && dust.cache[cacheKey]) {
            debug("found in cache at '%s'", cacheKey);
            return cb(null, dust.cache[cacheKey]);
        }

        debug("performing lookup for template '%s' and locale %j", ctx.templateName, locale);
        ctx.options.view.lookup(bundle, { locale: locale }, iferr(cb, function (file) {
            debug("lookup for template '%s' and locale %j gave %j", ctx.templateName, locale, file);
            fs.readFile(file, 'utf-8', iferr(cb, function (data) {
                try {
                    var parsed = spud.parse(data);
                    if (dust.config.cache) {
                        debug("setting cache key '%s' to %j", cacheKey, parsed);
                        dust.cache[cacheKey] = parsed;
                    }

                    cb(null, parsed);
                } catch (e) {
                    cb(e);
                }
            }));
        }));
    };

    common(dust, debug, options, options.loader || loader);


};

function makeErr(ctx, bundle) {
    var str = "no view available rendering template named '%s' and content bundle '%s'";
    debug(str, ctx.templateName, bundle);
    return new VError(str, ctx.templateName, bundle);
}

function stringLocale(locale) {
    debug("normalizing locale %j", locale);
    if (!locale) {
        return undefined;
    } else if (typeof locale === 'string') {
        return locale;
    } else if (locale.country && locale.language) {
        return locale.language + '-' + locale.country;
    } else {
        return bcp47s(locale);
    }
}

function localeFromContext(ctx) {
    // Handle all the backward compatibility names (*Locality) and the new
    // ones, too.
    return stringLocale(ctx.get('contentLocale') || ctx.get('contentLocality') ||
        ctx.get('locale') || ctx.get('locality') || {});
}

module.exports.registerWith = module.exports;
