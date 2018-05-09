#!/usr/bin/env node
"use strict";

var nopt = require('nopt');
var path = require('path');

var conf = nopt({
    "language": String,
    "country": String,
    "root": path
}, {
    "l": "--language",
    "c": "--country"
});

var pack = require('./');

pack(conf.root || 'locales', conf.country || '*', conf.language || '*', function (err, out) {
    if (err) {
        throw err;
    }

    process.stdout.write(JSON.stringify(out));
});
