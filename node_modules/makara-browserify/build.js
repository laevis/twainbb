'use strict';

var fs = require('fs');
var browserify = require('browserify');
var through = require('through2');
var path = require('path');

var streamOf = function (str) {
    var o = through();
    process.nextTick(function () {
        o.end(str);
    });
    return o;
};
var writer = function (outputRoot, cb) {
    return function (out) {
        var b = browserify();
        b.require(streamOf('module.exports=' + JSON.stringify(out)), { expose: '_languagepack' })
          .bundle()
          .pipe(fs.createWriteStream(path.resolve(outputRoot, '_languagepack.js')))
          .on('finish', cb)
          .on('error', cb);
    };
};

module.exports = function build(appRoot, cb) {
    require('makara-builder')(appRoot, writer, cb);
};
