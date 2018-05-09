/* eslint-disable no-console, func-names */
'use strict';

var waterfallize = require('../');
var next = waterfallize();

next(function(callback) {
  callback(null, 'one', 'two');
});

next(function(arg1, arg2, callback) {
  console.log('arg1: %s, arg2: %s', arg1, arg2);
  // arg1 now equals 'one' and arg2 now equals 'two'
  setTimeout(function() {
    callback(null, 'three');
  }, 300);
});

next(function(arg1, callback) {
  console.log('arg1: %s', arg1);
  // arg1 now equals 'three'
  callback(null, 'done', 'wohoo');
});

// this is the main callback
next(function(err, arg1, arg2) {
  // results now equal [ 'one', 'two', 'three', 'done', 'wohoo' ]
  if (err) { throw err; }

  console.log('arg1: %s, arg2: %s', arg1, arg2);
});
