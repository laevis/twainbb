'use strict';

var REGIDX = new RegExp('\\$idx', 'g');
var REGKEY = new RegExp('\\$key', 'g');

module.exports = function (dust, options) {
    options = options || {};

    dust.helpers.pre = dust.helpers.message = function message(chunk, ctx, bodies, params) {

        if (params.type && params.type !== 'content') {
            return chunk.write('');
        }

        var before = params.before || '';
        var after = params.after || '';
        var mode = params.mode || '';
        var sep = params.sep || '';

        var value = ctx.get('intl.messages' + '.' + params.key) || ctx.get('messages' + '.' + params.key) || '☃' + params.key + '☃';

        if (typeof value === 'string') {

            value = (mode === 'json') ? JSON.stringify(value) : (before + value + after);

        } else if (typeof value === 'object' && value !== null) {

            // Object or Array
            if (mode === 'json') {
                value = JSON.stringify(value, substitute);
            } else if (mode === 'paired') {
                value = transform(value, asObj(value));
                value = JSON.stringify(value);
            } else {
                value = transform(value, asString(value, before, after));
                value = value.join(sep);
            }

        } else {
            // number, bool, date, etc? not likely, but maybe
            value = String(value);
        }

        if (options.enableMetadata && !params.noEdit) {
            value = '<edit data-key="' + quot(params.key) + '" data-bundle="' + quot(ctx.get('intl.bundle')) + '" data-original="' + quot(value) + '">' + value + '</edit>';
        }

        return chunk.map(function (chunk) {
            /* And thus begins the ugly, possibly expensive hack to run dynamically loaded content through Dust */
            var cacheKey = ctx.templateName + params.key + encodeURI(value).replace(/%/g, '_');
            var tmpl = dust.cache[cacheKey] || dust.loadSource(dust.compile(value, cacheKey));
            tmpl(chunk, ctx).end();
            /* Here endeth the confusion, on Setting Orange, the 56th day of Bureaucracy in the YOLD 3180 */
        });
    };

    function quot(str) {
        return dust.filter(str, undefined, ['h']);
    }
};

module.exports.registerWith = module.exports;

// Replace any $idx or $key values in the element
function substitute(key, value) {
    if (typeof value === 'string') {
        // Test for numeric value. If non-numeric, use $key, else $idx
        var regex = isNaN(parseInt(key, 10)) ? REGKEY : REGIDX;
        value = value.replace(regex, key);
    }
    return value;
}

function asString(obj, before, after) {
    var regex = Array.isArray(obj) ? REGIDX : REGKEY;

    return function stringPredicate(item) {
        var str, b, a, objItem;

        objItem = obj[item];
        // If mode parameter is missing on nested object, fail soft.
        if (typeof objItem !== 'string') {
            return '';
        }
        str = objItem.replace(regex, item);
        b = before.replace(regex, item);
        a = after.replace(regex, item);

        return b + str + a;
    };
}

function asObj(obj) {
    var regex = Array.isArray(obj) ? REGIDX : REGKEY;

    return function objectPredicate(item) {
        var id = parseInt(item, 10);
        if (typeof obj[item] === 'object') {
            var child =  transform(obj[item], asObj(obj[item]));
            return {
                '$id': isNaN(id) ? item : id,
                '$elt': child
            };
        }
        return {
            '$id': isNaN(id) ? item : id,
            '$elt': obj[item].replace(regex, item)
        };
    };

}

function transform (obj, predicate) {
    return Object.keys(obj).map(predicate);
}
