var assert = require('assert');

module.exports = function permutron() {
    var args = Array.prototype.slice.apply(arguments);
    var donecb = args.pop();
    var iterator = args.pop();

    assert(typeof iterator == 'function');
    assert(typeof donecb == 'function');

    permute(args, function(pass, next) {
        setImmediate(function() {
            iterator.apply(null, pass.concat(next));
        });
    }, donecb);

};

module.exports.raw = permute;

module.exports.object = permuteObject;

function permuteObject(object, iterator, donecb) {
    assert(typeof iterator == 'function');
    assert(typeof donecb == 'function');
    var keys = Object.keys(object);

    permute(keys.map(function (e) { return object[e]; }), function(pass, next) {
        setImmediate(function() {
            var obj = {};
            for (var i in keys) {
                obj[keys[i]] = pass[i];
            }
            iterator(obj, next);
        });
    }, donecb);
}

function permute(args, iterator, donecb) {
    assert(typeof iterator == 'function');
    assert(typeof donecb == 'function');

    if (typeof args[0] == 'function') {
        generate(args[0], handler, donecb);
    } else {
        asyncEach(Array.isArray(args[0]) ? args[0] : [args[0]], handler, donecb);
    }

    function handler(cur, j, next) {
        if (args.length == 1) {
            iterator([cur], next);
        } else {
            permute(args.slice(1), function (further, next) {
                setImmediate(function() {
                    iterator([cur].concat(further), next);
                });
            }, next);
        }
    }
}

function generate(func, iterator, done) {
    var i = 0;
    var context = {};

    function gen() {
        func(i, context, function afterGeneration(err, result) {
            if (err) {
                return done(err);
            } else {
                iterator(result.value, i++, function continueGenerator(err) {
                    if (err) {
                        return done(err);
                    } else if (result.done) {
                        return done();
                    } else {
                        gen();
                    }
                });
            }
        });
    }

    gen();
}

function asyncEach(array, iterator, done) {
    var i = 0;
    function iterate() {
        if (i >= array.length) {
            return done();
        }

        setImmediate(function() {
            iterator(array[i], i++, iterate);
        });
    }

    iterate();
}

function zero() {
    return 0;
}
