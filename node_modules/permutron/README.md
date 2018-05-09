# Permutron

Asynchronously iterate permutations of function arguments

## Synopsis

```
var permutron = require('permutron');
```

```
permutron('static', ['permutable'], 'static', generator, ['permutable'], function (a, b, c, d, next) { }, done);

function generator(n, context, next) {
    next(null, {value: n, done: n > 1});
};
```

```
permutron.raw(['static', ['permutable'], 'static', ['permutable']], function(row, next) { }, done);
```

```
permutron.object({static: "static", permute: ['permutable']}, function (obj, next) { }, done);
```

## Description

Permutron simply iterates over each argument, giving one permutation each time.

Arguments that are arrays are used as sources of permutations, other arguments are passed along statically.

## Example

```
var permutron = require('permutron');

permutron('static1', ['dynamic1', 'dynamic2'], ['dynamic3', 'dynamic4'], generator, 'static2', function (a, b, c, d, e, next()) {
    console.log(a, b, c, d, e);
    next();
}, function (err) {
    console.log('done!');
});

function generator(n, context, next) {
    next(null, {value: n, done: n > 1});
};
```

Will output:

```
static1 dynamic1 dynamic3 0 static2
static1 dynamic1 dynamic4 1 static2
static1 dynamic1 dynamic3 0 static2
static1 dynamic1 dynamic4 1 static2
static1 dynamic2 dynamic3 0 static2
static1 dynamic2 dynamic4 1 static2
static1 dynamic2 dynamic3 0 static2
static1 dynamic2 dynamic4 1 static2
done!
```
