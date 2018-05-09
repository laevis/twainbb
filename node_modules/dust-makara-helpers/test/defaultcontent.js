"use strict";
var makarahelpers = require('../');
var test = require('tap').test;
var path = require('path');
var fs = require('fs');
var freshy = require('freshy').freshy;
var makeViewClass = require('engine-munger');
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

function render(dust, name, context, cb) {
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


test('apply default content', function (t) {
    var dust = newDust();

    makarahelpers.registerWith(dust);

    render(dust, 'apply-default-content', { locale: { country: 'US', language: 'en' } }, function (err, out) {
        t.error(err);
        t.equal(out, 'Hello, World');
        t.end();
    });
});

test('apply default content when layout present', function (t) {
    var dust = newDust();

    makarahelpers.registerWith(dust);

    render(dust, 'default-content-with-layout', { locale: { country: 'US', language: 'en' } }, function (err, out) {
        t.error(err);
        t.equal(out, 'Hello, World');
        t.end();
    });
});

test('Make sure unrequested content is unavailable', function (t) {
    var dust = newDust();

    makarahelpers.registerWith(dust);

    render(dust, 'unrequested-content', { locale: { country: 'US', language: 'en' } }, function (err, out) {
        t.error(err);
        t.equal(out, 'Hello, ☃world☃');
        t.end();
    });
});

test('Make sure autoloading content behavior can be disabled', function (t) {
    var dust = newDust();

    makarahelpers.registerWith(dust, {
        autoloadTemplateContent: false
    });

    render(dust, 'simple', { locale: { country: 'US', language: 'en' } }, function (err, out) {
        t.error(err);
        t.equal(out, '☃hello☃');
        t.end();
    });
});
