/* eslint-disable no-console, func-names */
'use strict';

var test = require('tape');
var waterfallize = require('../');

test('functions should run in order', function(t) {
  var next = waterfallize();
  var order = [];

  next(function(callback) {
    order.push(1);
    callback();
  });

  next(function(callback) {
    order.push(2);
    callback();
  });

  next(function(callback) {
    order.push(3);
    callback();
  });

  next(function(err) {
    t.error(err, 'should not throw an error');

    t.deepEqual(order, [1, 2, 3]);
    t.end();
  });
});

test('should handle passing an error to the cb', function(t) {
  var next = waterfallize();
  var order = [];
  var fakeErr = new Error('stop');

  next(function(callback) {
    order.push(1);
    callback(fakeErr);
  });

  next(function(callback) {
    order.push(2);
    callback();
  });

  next(function(callback) {
    order.push(3);
    callback();
  });

  next(function(err) {
    t.equal(fakeErr, err);

    t.deepEqual(order, [1]);
    t.end();
  });
});

test('should throw an error for functions added async', function(t) {
  var next = waterfallize();

  setImmediate(function() {
    try {
      next(function() { });
    } catch (e) {
      t.ok(/tick/ig.test(e.message));
      t.end();
    }
  });
});
