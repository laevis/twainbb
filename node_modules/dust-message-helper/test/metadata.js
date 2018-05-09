'use strict';

var test = require('tap').test;
var freshy = require('freshy').freshy;
var helper = require('../');

var messages = {
    hello: "world! < > & ' \""
};

test('metadata enabled', function (t) {
    var dust = freshy('dustjs-linkedin');
    helper.registerWith(dust, { enableMetadata: true });

    var tmpl = dust.loadSource(dust.compile('{@message key="hello"/}'));
    dust.render(tmpl, { intl: {messages: messages, bundle: 'bundle' } }, function (err, data) {
        t.error(err);
        t.equal(data, '<edit data-key="hello" data-bundle="bundle" data-original="world! &lt; &gt; &amp; &#39; &quot;">world! < > & \' "</edit>');
        t.end();
    });

});

test('metadata disabled by tag', function (t) {
    var dust = freshy('dustjs-linkedin');
    helper.registerWith(dust, { enableMetadata: true });

    var tmpl = dust.loadSource(dust.compile('{@message noEdit="true" key="hello"/}'));
    dust.render(tmpl, { intl: {messages: messages, bundle: 'bundle' } }, function (err, data) {
        t.error(err);
        t.equal(data, 'world! < > & \' "');
        t.end();
    });

});

test('metadata disabled by config', function (t) {
    var dust = freshy('dustjs-linkedin');
    helper.registerWith(dust);

    var tmpl = dust.loadSource(dust.compile('{@message noEdit="true" key="hello"/}'));
    dust.render(tmpl, { intl: {messages: messages, bundle: 'bundle' } }, function (err, data) {
        t.error(err);
        t.equal(data, 'world! < > & \' "');
        t.end();
    });

});
