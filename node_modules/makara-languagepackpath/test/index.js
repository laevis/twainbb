"use strict";

var test = require('tape');

var mlp = require('../');

test('languge pack path', function(t) {
    t.plan(2);

    t.test('should test languagePackPath', (t) => {
        t.equal(mlp.languagePackPath({
            country: "XC",
            language: "en"
        }), 'en-XC/_languagepack.js');
        t.equal(mlp.languagePackPath('en-XC'), 'en-XC/_languagepack.js');
        t.equal(mlp.languagePackPath({
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
        t.equal(mlp.languagePackPath('en-XC', true), 'en-XC/_languagepack');
        t.end();
    });

    t.test('should test custom middleware', (t) => {
        const middleware = mlp.middleware({
            localeContext: 'customLocals'
        });
        const res = {
            locals: {
                customLocals: {
                    langtag: {
                        language: {
                            language: 'en',
                            extlang: []
                        },
                        script: null,
                        region: 'C2',
                        variant: [],
                        extension: [],
                        privateuse: []
                    },
                    privateuse: [],
                    grandfathered: {
                        irregular: null,
                        regular: null
                    }
                },
                makara: {
                    language: {
                        language: 'en',
                        extlang: []
                    },
                    script: null,
                    region: 'C2',
                    variant: [],
                    extension: [],
                    privateuse: []
                }
            }
        };
        middleware({}, res, () => {
            t.deepEqual(res.locals, {
                "customLocals": {
                    "langtag": {
                        "language": {
                            "language": "en",
                            "extlang": []
                        },
                        "script": null,
                        "region": "C2",
                        "variant": [],
                        "extension": [],
                        "privateuse": []
                    },
                    "privateuse": [],
                    "grandfathered": {
                        "irregular": null,
                        "regular": null
                    }
                },
                "makara": {
                    "language": {
                        "language": "en",
                        "extlang": []
                    },
                    "script": null,
                    "region": "C2",
                    "variant": [],
                    "extension": [],
                    "privateuse": [],
                    "languagePackPath": "en-C2/_languagepack.js"
                }
            });
            t.end();
        });
    })
});
