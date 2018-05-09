# waterfallize

Control flow library, similar to [async.waterfall](https://github.com/caolan/async#waterfall) but with a different API and faster.

Runs some functions in series, each passing their results to the next function. If a function passes an error to the callback, then the main callback is immediately called with the error (skipping the other functions).

[![Build Status](https://travis-ci.org/alessioalex/waterfallize.svg)](https://travis-ci.org/alessioalex/waterfallize)

# example

```js
var waterfallize = require('waterfallize');
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

// main callback
next(function(err, arg1, arg2) {
  // results now equal [ 'one', 'two', 'three', 'done', 'wohoo' ]
  if (err) { throw err; }

  console.log('arg1: %s, arg2: %s', arg1, arg2);
});
```

# install

Via [npm](http://npmjs.org):

```
npm install waterfallize
```

# how does it work

The functions are wrapped with the function returned by `waterfallize()`, then executed async in order (using `setImmediate` internally).
That means that you need to add all of them in the same tick for things to function properly.

# test

Run the following command:

```
npm test
```

# benchmark

To compare the performance of the module with other popular alternatives run the following command into the terminal:

```
npm run benchmark
```

# license

[MIT](http://alessioalex.mit-license.org/)
