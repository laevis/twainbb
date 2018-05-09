/* eslint-disable no-console, func-names, no-unused-vars */
'use strict';

var cpus = require('os').cpus().length;
var async = require('async');
var neoAsync = require('neo-async');
var waterfall = require('run-waterfall');
var fall = require('fastfall')();
var waterfallize = require('../');

suite('waterfall alternatives', function() {
  set('iterations', 100000);
  set('mintime', 2000);
  set('concurrency', cpus);

  bench('neo-async.waterfall', function(done) {
    neoAsync.waterfall([
      function(callback) {
        setImmediate(function() {
          callback(null, 'one', 'two');
        });
      },
      function(arg1, arg2, callback) {
        setImmediate(function() {
          callback(null, 'three');
        });
      },
      function(arg1, callback) {
        setImmediate(function() {
          callback(null, 'done', 'wohoo');
        });
      }
    ], function(err, result1, result2) {
      if (err) { throw err; }

      done();
    });
  });

  bench('fastfall', function(done) {
    fall([
      function(callback) {
        setImmediate(function() {
          callback(null, 'one', 'two');
        });
      },
      function(arg1, arg2, callback) {
        setImmediate(function() {
          callback(null, 'three');
        });
      },
      function(arg1, callback) {
        setImmediate(function() {
          callback(null, 'done', 'wohoo');
        });
      }
    ], function(err, result1, result2) {
      if (err) { throw err; }

      done();
    });
  });

  bench('waterfallize', function(done) {
    var next = waterfallize();

    next(function(callback) {
      setImmediate(function() {
        callback(null, 'one', 'two');
      });
    });

    next(function(arg1, arg2, callback) {
      setImmediate(function() {
        callback(null, 'three');
      });
    });

    next(function(arg1, callback) {
      setImmediate(function() {
        callback(null, 'done', 'wohoo');
      });
    });

    next(function(err, results) {
      if (err) { throw err; }

      done();
    });
  });

  bench('run-waterfall', function(done) {
    waterfall([
      function(callback) {
        setImmediate(function() {
          callback(null, 'one', 'two');
        });
      },
      function(arg1, arg2, callback) {
        setImmediate(function() {
          callback(null, 'three');
        });
      },
      function(arg1, callback) {
        setImmediate(function() {
          callback(null, 'done', 'wohoo');
        });
      }
    ], function(err, result1, result2) {
      if (err) { throw err; }

      done();
    });
  });

  bench('async.waterfall', function(done) {
    async.waterfall([
      function(callback) {
        setImmediate(function() {
          callback(null, 'one', 'two');
        });
      },
      function(arg1, arg2, callback) {
        setImmediate(function() {
          callback(null, 'three');
        });
      },
      function(arg1, callback) {
        setImmediate(function() {
          callback(null, 'done', 'wohoo');
        });
      }
    ], function(err, result1, result2) {
      if (err) { throw err; }

      done();
    });
  });
});
