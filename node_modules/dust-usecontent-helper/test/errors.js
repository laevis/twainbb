"use strict";

var test = require('tap').test;
var dustjs = require('dustjs-linkedin');
var helper = require('../');

test('arity check', function (t) {
    t.throws(function () {
        helper(function() {
        })
    }, { name: 'TypeError' });

    t.end();
});

test('type check', function (t) {
    t.throws(function () {
        helper("String");
    }, { name: 'TypeError' });

    t.end();
});

test('loader fails', function (t) {
    t.plan(3);
    helper(function (a, b, c) {
        t.pass('called');
        c(new Error('oops'));
    }).registerWith(dustjs);

    var tmpl = dustjs.loadSource(dustjs.compile('{@useContent bundle="oops"}test{/useContent}'));
    dustjs.render(tmpl, {}, function (err, body) {
        t.match(err, { message: "oops" });
        t.error(body);
        t.end();
    });
});
