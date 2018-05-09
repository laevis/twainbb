'use strict';

var test = require('tap').test;
var dust = require('dustjs-linkedin');

require('../').registerWith(dust);

var messages = {
    types: {
        name: 'world',
        tabs4: '4tabs\t\t\t\ttab',
        'textQuote': '"This has quotes"',
        'backslashQuote': 'I\\O',
        'controlQuote': 'tab	tab',
        'states': ['CA', 'MI', 'OR'],
        'listQuote': [
            '"This has quotes"',
            'I\\O',
            'tab	tab'
        ],
        'months': {
            '1': '1',
            '2': '2',
            '3': '3'
        },
        'state': {
            'CA': 'California',
            'MI': 'Michigan',
            'OR': 'Oregon'
        },
        'stooge': {
            'Larry': '$key Fine',
            'Moe': '$key Howard',
            'Curly': '$key Howard',
            'Shemp': '$key Howard'
        },
        'names': [
            '$idx. Larry',
            '$idx. Moe',
            '$idx. Curly'
        ],
        'states2': {
            'west': [ 'CA', undefined, 'OR' ],
            'east': [ 'MI' ]
        },
        'bankRules': {
            'BOFA': {
                'bankInfo': 'Payment',
                'transfer': 'Transfers'
            },
            'HSBC': {
                'bankInfo': 'Foreign',
                'transfer': 'Others'
            }
        }
    }
};

test('handler', function (t) {

    var basic, list, map;

    basic = [
        {
            it: 'should replace a pre tag with localized content',
            input: 'Hello, {@pre type="content" key="types.name" /}!',
            expected: 'Hello, world!'
        },
        {
            it: 'should replace a pre tag with localized content preserving tabs',
            input: '{@pre type="content" key="types.tabs4" /}',
            expected: '4tabs\t\t\t\ttab'
        },
        {
            it: 'should gracefully handle missing \'key\' attribute.',
            input: 'Hello, {@pre type="content" /}!',
            expected: 'Hello, ☃undefined☃!'
        },
        {
            it: 'should replace a pre tag with localized content and support mode=json',
            input: 'Hello, {@pre type="content" key="types.name" mode="json"/}!',
            expected: 'Hello, \"world\"!'
        },
        {
            it: 'should replace a pre tag with localized content and support mode=paired',
            input: 'Hello, {@pre type="content" key="types.name" mode="paired"/}!',
            expected: 'Hello, world!'
        },
        {
            it: 'should replace a pre tag with localized content, support mode=paired and ignore before/after',
            input: 'Hello, {@pre type="content" key="types.name" mode="json" before="[" after="]" /}!',
            expected: 'Hello, \"world\"!'
        },
        {
            it: 'should replace a pre tag with localized content and support before/after',
            input: 'Hello, {@pre type="content" key="types.name" before="[" after="]" /}!',
            expected: 'Hello, [world]!'
        },
        {
            it: 'should handle escaping',
            input: '{@pre type="content" key="types.textQuote"/}',
            expected: '\"This has quotes\"'
        },
        {
            it: 'should handle backslash escaping',
            input: '{@pre type="content" key="types.backslashQuote"/}',
            expected: 'I\\O'
        },
        {
            it: 'should handle control escaping',
            input: '{@pre type="content" key="types.controlQuote"/}',
            expected: 'tab\ttab'
        },
        {
            it: 'should handle escaping',
            input: '{@pre type="content" key="types.textQuote" mode="json"/}',
            expected: '\"\\"This has quotes\\"\"'
        },
        {
            it: 'should handle backslash escaping',
            input: '{@pre type="content" key="types.backslashQuote" mode="json"/}',
            expected: '\"I\\\\O\"'
        },
        {
            it: 'should handle control escaping',
            input: '{@pre type="content" key="types.controlQuote" mode="json"/}',
            expected: '\"tab\\ttab\"'
        },
        {
            it: 'should ignore unrecognized tags',
            input: 'Hello, {@pre type="link" /}!',
            expected: 'Hello, !'
        }
    ];

    list = [
        {
            it: 'should recognize list type',
            input: 'Hello, {@pre type="content" key="types.states" /}!',
            expected: 'Hello, CAMIOR!'
        },
        {
            it: 'should support the "sep" attribute',
            input: 'Hello: {@pre type="content" key="types.states" sep=", " /}!',
            expected: 'Hello: CA, MI, OR!'
        },
        {
            it: 'should support the "mode=json" attribute',
            input: '{@pre type="content" key="types.states" mode="json" /}',
            expected: '["CA","MI","OR"]'
        },
        {
            it: 'should support the "mode=paired" attribute',
            input: '{@pre type="content" key="types.states" mode="paired" /}',
            expected: '[{"$id":0,"$elt":"CA"},{"$id":1,"$elt":"MI"},{"$id":2,"$elt":"OR"}]'
        },
        {
            it: 'should support the "mode=json" attribute and escape correctly',
            input: '{@pre type="content" key="types.listQuote" mode="json" /}',
            expected: '["\\"This has quotes\\"","I\\\\O","tab\\ttab"]'
        },
        {
            it: 'should support the "mode=paired" attribute and escape correctly',
            input: '{@pre type="content" key="types.listQuote" mode="paired" /}',
            expected: '[{"$id":0,"$elt":"\\"This has quotes\\""},{"$id":1,"$elt":"I\\\\O"},{"$id":2,"$elt":"tab\\ttab"}]'
        },
        {
            it: 'should support "mode=json" and ignore before/after when present',
            input: '{@pre type="content" key="types.states" mode="json" before="->" after="->"/}',
            expected: '["CA","MI","OR"]'
        },
        {
            it: 'should support "mode=paired" and ignore before/after when present',
            input: '{@pre type="content" key="types.states" mode="paired" before="->" after="->"/}',
            expected: '[{"$id":0,"$elt":"CA"},{"$id":1,"$elt":"MI"},{"$id":2,"$elt":"OR"}]'
        },
        {
            it: 'should support "mode=json" and ignore sep when present',
            input: '{@pre type="content" key="types.states" mode="json" sep="+" /}',
            expected: '["CA","MI","OR"]'
        },
        {
            it: 'should support "mode=paired" and ignore sep when present',
            input: '{@pre type="content" key="types.states" mode="paired" sep="+" /}',
            expected: '[{"$id":0,"$elt":"CA"},{"$id":1,"$elt":"MI"},{"$id":2,"$elt":"OR"}]'
        },
        {
            it: 'should support the "mode=json" attribute and substitute $idx in content',
            input: '{@pre type="content" key="types.names" mode="json" /}',
            expected: '["0. Larry","1. Moe","2. Curly"]'
        },
        {
            it: 'should support the "mode=paired" attribute and substitute $idx in content',
            input: '{@pre type="content" key="types.names" mode="paired" /}',
            expected: '[{"$id":0,"$elt":"0. Larry"},{"$id":1,"$elt":"1. Moe"},{"$id":2,"$elt":"2. Curly"}]'
        },
        {
            it: 'should support the "before" attribute',
            input: 'Hello: {@pre type="content" key="types.states" before="->" /}!',
            expected: 'Hello: ->CA->MI->OR!'
        },
        {
            it: 'should support the "after" attribute',
            input: 'Hello: {@pre type="content" key="types.states" after="->" /}!',
            expected: 'Hello: CA->MI->OR->!'
        },
        {
            it: 'should support the "before" and "after" attributes',
            input: '<ul>{@pre type="content" key="types.states" before="<li>" after="</li>" /}</ul>',
            expected: '<ul><li>CA</li><li>MI</li><li>OR</li></ul>'
        },
        {
            it: 'should support the "before," "after," and "sep" attributes',
            input: '<ul>{@pre type="content" key="types.states" before="<li>" after="</li>" sep=" " /}</ul>',
            expected: '<ul><li>CA</li> <li>MI</li> <li>OR</li></ul>'
        },
        {
            it: 'should replace $idx placeholders in content strings',
            input: 'Hello: {@pre type="content" key="types.names" after="->" /}',
            expected: 'Hello: 0. Larry->1. Moe->2. Curly->'
        },
        {
            it: 'should replace $idx placeholders in before and after attributes, but not sep',
            input: 'Hello: {@pre type="content" key="types.names" before="$idx" after="$idx" sep="$idx" /}',
            expected: 'Hello: 00. Larry0$idx11. Moe1$idx22. Curly2'
        },
        {
            it: 'should fail gracefully when mode is not set',
            input: '{@pre type="content" key="types.states2" before="#" after="@" /}',
            expected: ''
        }
    ];

    map = [
        {
            it: 'should recognize map type',
            input: 'Hello, {@pre type="content" key="types.state" /}!',
            expected: 'Hello, CaliforniaMichiganOregon!'
        },
        {
            it: 'should support the "sep" attribute',
            input: 'Hello: {@pre type="content" key="types.state" sep=", " /}!',
            expected: 'Hello: California, Michigan, Oregon!'
        },
        {
            it: 'should support the "mode=json" attribute',
            input: '{@pre type="content" key="types.state" mode="json" /}',
            expected: '{\"CA\":\"California\",\"MI\":\"Michigan\",\"OR\":\"Oregon\"}'
        },
        {
            it: 'should support the "mode=paired" attribute',
            input: '{@pre type="content" key="types.state" mode="paired" /}',
            expected: '[{\"$id\":\"CA\",\"$elt\":\"California\"},{\"$id\":\"MI\",\"$elt\":\"Michigan\"},{\"$id\":\"OR\",\"$elt\":\"Oregon\"}]'
        },
        {
            it: 'should support the "mode=paired" with multi-level object',
            input: '{@pre type="content" key="types.bankRules" mode="paired" /}',
            expected: '[{\"$id\":\"BOFA\",\"$elt\":[{\"$id\":\"bankInfo\",\"$elt\":\"Payment\"},{\"$id\":\"transfer\",\"$elt\":\"Transfers\"}]},{\"$id\":\"HSBC\",\"$elt\":[{\"$id\":\"bankInfo\",\"$elt\":\"Foreign\"},{\"$id\":\"transfer\",\"$elt\":\"Others\"}]}]'
        },
        {
            it: 'should support the "mode=json" attribute and ignore before/after if present',
            input: '{@pre type="content" key="types.state" mode="json" before="->" after="->" /}',
            expected: '{\"CA\":\"California\",\"MI\":\"Michigan\",\"OR\":\"Oregon\"}'
        },
        {
            it: 'should support the "mode=paired" attribute and ignore before/after if present',
            input: '{@pre type="content" key="types.state" mode="paired" before="->" after="->" /}',
            expected: '[{\"$id\":\"CA\",\"$elt\":\"California\"},{\"$id\":\"MI\",\"$elt\":\"Michigan\"},{\"$id\":\"OR\",\"$elt\":\"Oregon\"}]'
        },
        {
            it: 'should support the "mode=json" attribute and ignore sep if present',
            input: '{@pre type="content" key="types.state" mode="json" sep="+" /}',
            expected: '{\"CA\":\"California\",\"MI\":\"Michigan\",\"OR\":\"Oregon\"}'
        },
        {
            it: 'should support the "mode=paired" attribute and ignore sep if present',
            input: '{@pre type="content" key="types.state" mode="paired" sep="+" /}',
            expected: '[{\"$id\":\"CA\",\"$elt\":\"California\"},{\"$id\":\"MI\",\"$elt\":\"Michigan\"},{\"$id\":\"OR\",\"$elt\":\"Oregon\"}]'
        },
        {
            it: 'should support the "mode=json" attribute and substitute $key in content',
            input: '{@pre type="content" key="types.stooge" mode="json" /}',
            expected: '{\"Larry\":\"Larry Fine\",\"Moe\":\"Moe Howard\",\"Curly\":\"Curly Howard\",\"Shemp\":\"Shemp Howard\"}'
        },
        {
            it: 'should support the "mode=paired" attribute and substitute $key in content',
            input: '{@pre type="content" key="types.stooge" mode="paired" /}',
            expected: '[{\"$id\":\"Larry\",\"$elt\":\"Larry Fine\"},{\"$id\":\"Moe\",\"$elt\":\"Moe Howard\"},{\"$id\":\"Curly\",\"$elt\":\"Curly Howard\"},{\"$id\":\"Shemp\",\"$elt\":\"Shemp Howard\"}]'
        },
        {
            it: 'should support the "after" attribute',
            input: 'Hello: {@pre type="content" key="types.state" after="->" /}!',
            expected: 'Hello: California->Michigan->Oregon->!'
        },
        {
            it: 'should support the "before" and "after" attributes',
            input: '<ul>{@pre type="content" key="types.state" before="<li>" after="</li>" /}</ul>',
            expected: '<ul><li>California</li><li>Michigan</li><li>Oregon</li></ul>'
        },
        {
            it: 'should support the "before," "after," and "sep" attributes',
            input: '<ul>{@pre type="content" key="types.state" before="<li>" after="</li>" sep=" " /}</ul>',
            expected: '<ul><li>California</li> <li>Michigan</li> <li>Oregon</li></ul>'
        },
        {
            it: 'should replace $key placeholders in content strings',
            input: 'Hello: {@pre type="content" key="types.stooge" sep=", " /}',
            expected: 'Hello: Larry Fine, Moe Howard, Curly Howard, Shemp Howard'
        },
        {
            it: 'should replace $key placeholders in before and after attributes, but not sep',
            input: 'Hello: {@pre type="content" key="types.state" before="$key " after=" $key" sep=", $key " /}',
            expected: 'Hello: CA California CA, $key MI Michigan MI, $key OR Oregon OR'
        },
        {
            it: 'should support option list with attributes',
            input: '<select>{@pre type="content" key="types.months" before="<option value=$key>" after="</option>" /}</select>',
            expected: '<select><option value=1>1</option><option value=2>2</option><option value=3>3</option></select>'
        }
    ];


    function run(testcases, t) {
        var count, total, file, hand;

        count = 0;
        total = testcases.length;

        t.plan(total * 2);

        testcases.forEach(function (testcase) {
            var compiled = dust.compile(testcase.input, 'test');
            dust.loadSource(compiled);
            dust.render('test', { intl: {messages: messages } }, function (err, data) {
                t.error(err);

                t.equal(data, testcase.expected, testcase.it);
                count += 1;
                if (count === total) {
                    t.end();
                }
            });
        });
    }


    t.test('basic', run.bind(null, basic));
    t.test('list', run.bind(null, list));
    t.test('map', run.bind(null, map));

});
