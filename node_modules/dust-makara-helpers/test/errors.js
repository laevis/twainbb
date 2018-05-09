"use strict";
var makarahelpers = require('../');
var test = require('tap').test;
var path = require('path');
var fs = require('fs');
var freshy = require('freshy').freshy;

function newDust() {
    var dust = freshy('dustjs-linkedin');

    dust.debugLevel = 'WARN';

    dust.onLoad = function(name, options, cb) {
        fs.readFile(path.resolve(__dirname, 'fixtures/templates', name + '.dust'), 'utf-8', cb);
    };

    return dust;
}

test('Make sure it is registered after a .onLoad', function (t) {
    t.throws(function () {
        var dust = freshy('dustjs-linkedin');
        makarahelpers.registerWith(dust);
    }, {
        message: "dust.onLoad must be configured to use automatic content loading"
    });
    t.end();
});

test('Make sure a view instance is passed', function (t) {
    var dust = freshy('dustjs-linkedin');

    dust.onLoad = function(name, options, cb) {
        fs.readFile(path.resolve(__dirname, 'fixtures/templates', name + '.dust'), 'utf-8', cb);
    };

    makarahelpers.registerWith(dust);

    dust.render('simple', { locale: { country: 'US', language: 'en' } }, function (err, out) {
        t.match(err, { message: "no view available rendering template named 'simple' and content bundle 'simple.properties'" });
        t.notOk(out);
        t.end();
    });
});
