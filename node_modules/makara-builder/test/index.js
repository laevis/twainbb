'use strict';

var tap = require('tap');
var builder = require('../');
var locales = ['en-US', 'fr-FR', 'de-FR'];
var path = require('path');
var appRoot = path.resolve(__dirname);

var writer = function (root, cb) {
	return function (out) {
		var deleted;
		for (var locale in out) {
			deleted = locales.splice(locales.indexOf(locale), 1);
		}
		if (deleted.length === 0) {
			return cb(new Error('tried deleting a locale not in the array'));
		}
		cb(null);
	};
};

tap.test('check that locale directories are properly identified', function (t) {
	t.plan(3);
	t.type(builder, 'function');
	t.equal(builder.length, 3);
	builder(appRoot, writer, function (err) {
		if (err) {
			throw err;
		}
		t.equal(locales.length, 0);
	});
});
