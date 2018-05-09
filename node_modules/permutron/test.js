#!/usr/bin/env node

var test = require('tape');
var permutron = require('./');

test('Permute in least-significant-first (rightmost-first) order', function (t) {

    var results = [];
    permutron([1, 2], [3, 4], function (a, b, next) {
        results.push(a);
        results.push(b);
        next();
    }, function (err) {
        if (err) t.fail(err);
        t.ok(results.indexOf(4) < results.indexOf(2), "Iteration got to the highest value of the rightmost array before it got to the next value of the leftmost array");
        t.equal(results.length, 8);
        t.end();
    });

});

test('Permute supporting non-array arguments as single combinations', function (t) {

    var results = [];
    permutron('before', [1, 2], 'after', function (before, mid, after, next) {
        results.push([before, mid, after]);
        next();
    }, function (err) {
        if (err) t.fail(err);
        t.deepEqual(results[0], ['before', 1, 'after']);
        t.deepEqual(results[1], ['before', 2, 'after']);
        t.equal(results.length, 2);
        t.end();
    });

});

test('Permute supporting functions as generators', function (t) {

    var results = [];
    permutron('before', generator, 'after', function (before, mid, after, next) {
        results.push([before, mid, after]);
        next();
    }, function (err) {
        if (err) t.fail(err);
        t.deepEqual(results[0], ['before', 1, 'after']);
        t.deepEqual(results[1], ['before', 2, 'after']);
        t.equal(results.length, 2);
        t.end();
    });

    function generator(i, context, next) {
        next(null, {value: i + 1, done: i >= 1});
    }

});

test('Permute values of objects', function (t) {

    var results = [];
    permutron.object({before: 'before', mid: [1, 2], after: 'after'}, function (obj, next) {
        results.push(obj);
        next();
    }, function (err) {
        if (err) t.fail(err);
        t.deepEqual(results[0], {before: 'before', mid: 1, after: 'after'});
        t.deepEqual(results[1], {before: 'before', mid: 2, after: 'after'});
        t.equal(results.length, 2);
        t.end();
    });
});

test('z͖a̶lg̮̙o̟̮̺͙̞̜͘', function (t) {
    var results;
    permutron(1, function (a, next) {
        results = a;
        next();
    }, function() {
        t.end();
    });

    t.ok(typeof results == 'undefined', 'action deferred');
});
