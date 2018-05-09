"use strict";

var test = require('tape');
var path = require('path');
var fs = require('fs');

var bksb = require('../');

test('build', function(t) {
    var root = path.resolve(__dirname, 'fixture');
    bksb.build(root, function(err) {
        t.error(err, 'no error');

        fs.readFile(path.resolve(root, '.build/en-XC/_languagepack.js'), function(err, data) {
            t.error(err, 'no error loading result');

            var result;
            eval(data + '; result = require("_languagepack")');

            t.ok(result['en-XC'], "found our language in the output");
            t.equal(result['en-XC']['index.properties'].hello, 'World', "found translation");
            t.equal(result['en-XC']['nested/index.properties'].hello, 'World', "found nested translation");
        });

    });
    t.end();
});

test('languge pack path', function(t) {
    t.equal(bksb.languagePackPath({
        country: "XC",
        language: "en"
    }), 'en-XC/_languagepack.js');
    t.equal(bksb.languagePackPath('en-XC'), 'en-XC/_languagepack.js');
    t.equal(bksb.languagePackPath({
        langtag: {
            language: {
                language: 'en',
                extlang: []
            },
            script: null,
            region: 'XC',
            variant: [],
            extension: [],
            privateuse: []
        },
        privateuse: [],
        grandfathered: {
            irregular: null,
            regular: null
        }
    }), 'en-XC/_languagepack.js');
    t.end();
});
