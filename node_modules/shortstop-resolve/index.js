'use strict';

var resolve = require('resolve');
var caller = require('caller');
var path = require('path');

module.exports = function (basedir) {
  basedir = basedir || path.dirname(caller());
  return function (name, cb) {
    resolve(name, { basedir: basedir }, function (err, result) {
      cb(err, result);
    });
  }
}
