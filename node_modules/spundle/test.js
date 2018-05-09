"use strict";

var test = require('tap').test;
var spundle = require('./');
var path = require('path');

test('does it make a bundle?!', function (t) {
    spundle(path.resolve(__dirname, 'test-fixtures'), 'US', 'en', function (err, result) {
        t.error(err);
        t.ok(result);
        t.ok(result['en-US']);
        t.equal(result['en-US']['world.properties'].world, 'World', 'found translation');
        t.equal(result['en-US']['nested/world.properties'].world, 'World', 'found nested translation');
        t.notOk(result['es-AR']);
        t.end();
    });
});

test('wildcards', function (t) {
    spundle(path.resolve(__dirname, 'test-fixtures'), '*', '*', function (err, result) {
        t.error(err);
        t.ok(result);
        t.ok(result['en-US']);
        t.ok(result['es-AR']);
        t.end();
    });
});