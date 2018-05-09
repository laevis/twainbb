"use strict";

var common = require('./common');

module.exports = function(dust, options) {
    options = options || {};

    common(dust, function () {}, options, options.loader);
};

module.exports.registerWith = module.exports;
