"use strict";

var mlpp = require('makara-languagepackpath');

module.exports = {
    build: function (root, cb) {
        require('./build')(root, cb);
    },
    languagePackPath: mlpp.languagePackPath,
    middleware: mlpp.middleware
};
