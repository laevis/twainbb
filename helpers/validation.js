'use strict';

var deepcopy = require('deepcopy');
var Ajv = require('ajv');
var ajv = new Ajv({allErrors: true, jsonPointers: true});
var specification = require("./specification.json");

require('ajv-errors')(ajv /*, {singleError: true} */);

var validateAPIParams = function(req, res, callback) {
    var copy = deepcopy(specification);
    var raw;

    if(["HEAD", "DELETE", "GET"].includes(req.method)) {
        raw = req.query;
    } else {
        raw = req.body;
    }

    var modules = req.baseUrl.split('/');
    modules = modules.splice(3);

    if (modules.length == 1) {
        modules.push('');
    }

    modules.forEach(function(i) {
        copy = copy[i];
    });

    copy = copy[req.method];

    var valid = ajv.validate(copy, raw);

    if (!valid) {
        callback(new Error(), ajv.errors);
    } else {
        callback(null, null);
    }
}

module.exports = validateAPIParams;
