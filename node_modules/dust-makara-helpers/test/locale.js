"use strict";
var makarahelpers = require('../');
var test = require('tap').test;
var path = require('path');
var fs = require('fs');
var freshy = require('freshy').freshy;
var bcp47 = require('bcp47');
var makeViewClass = require('engine-munger');

function render(dust, name, context, cb) {
    var View = makeViewClass({
        properties: {
            root: path.resolve(__dirname, 'fixtures'),
            i18n: {
                fallback: 'en-US',
                formatPath: function (locale) {
                    return path.join(locale.langtag.region, locale.langtag.language.language);
                }
            }
        }
    });

    var ctx = dust.context(context, { view: new View(name + '.dust', { engines: { ".dust": function() {} } }) });
    ctx.templateName = name;
    dust.render(name, ctx, cb);
}

function newDust() {
    var dust = freshy('dustjs-linkedin');

    dust.debugLevel = 'WARN';

    dust.onLoad = function(name, options, cb) {
        fs.readFile(path.resolve(__dirname, 'fixtures/templates', name + '.dust'), 'utf-8', cb);
    };

    return dust;
}

test('No locale', function (t) {
    var dust = newDust();

    makarahelpers.registerWith(dust);

    render(dust, 'simple', {}, function (err, out) {
        t.error(err);
        t.equal(out, 'Hello');
        t.end();
    });
});

test('Locale as simple object', function (t) {
    var dust = newDust();

    makarahelpers.registerWith(dust);

    render(dust, 'simple', { locale: { language: 'es', country: 'AR' } }, function (err, out) {
        t.error(err);
        t.equal(out, 'Hola');
        t.end();
    });
});

test('Locale as bcp47 object', function (t) {
    var dust = newDust();

    makarahelpers.registerWith(dust);

    render(dust, 'simple', { locale: bcp47.parse('es-AR') }, function (err, out) {
        t.error(err);
        t.equal(out, 'Hola');
        t.end();
    });
});

test('Locale as bcp47 string', function (t) {
    var dust = newDust();

    makarahelpers.registerWith(dust);

    render(dust, 'simple', { locale: 'es-AR' }, function (err, out) {
        t.error(err);
        t.equal(out, 'Hola');
        t.end();
    });
});
