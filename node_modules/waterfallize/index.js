'use strict';

var immediate = require('set-immediate-shim');
var slice = require('sliced');

function Series() {
  if (!(this instanceof Series)) {
    return new Series();
  }

  this.stack = [];
  this.index = 0;
  this.started = false;

  var that = this;

  // once all functions have been added to the 'stack' (in the same 'tick')
  // start the waterfall
  immediate(function start() {
    that.started = true;

    /* istanbul ignore else */
    if (that.stack.length) {
      that.iterate();
    }
  });

  // add functions to the 'stack'
  return function add(fn) {
    if (that.started) {
      throw new Error('Please add all functions in the same `tick`');
    }

    that.stack.push(fn);
  };
}

Series.prototype.iterate = function iterate() {
  var that = this;
  var args = slice(arguments);

  var cb = function cb(err) {
    // when there's an error return early and stop the iteration
    if (err) {
      return that.stack[that.stack.length - 1].call(null, err);
    }

    that.index++;
    that.iterate.apply(that, slice(arguments, 1));
  };

  if (this.index < (this.stack.length - 1)) {
    args.push(cb);
  } else {
    // for the final cb, prepend a `null` error argument
    args.unshift(null);
  }

  this.stack[this.index].apply(null, args);
};

module.exports = Series;
