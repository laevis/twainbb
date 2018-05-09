"use strict";
var glob = require('glob');
var async = require('async');
var iferr = require('iferr');
var path = require('path');
var spud = require('spud');
var fs = require('fs');

module.exports = function gloob(dir, cb) {
    var out = {};
    glob(path.resolve(dir, '**/*.properties'), iferr(cb, function (ents) {
        async.eachLimit(ents, 2, function(ent, next) {
            fs.readFile(ent, 'utf-8', iferr(next, function (file) {
                out[getKey(dir, ent)] = spud.parse(file);
                next();
            }));
        }, iferr(cb, function () {
            cb(null, out);
        }));
    }));

    function getKey(dir, ent) {
        var key = path.relative(dir, ent);
        return (process.platform === 'win32') ? key.replace(/\\/g, '/') : key;
    };
};
