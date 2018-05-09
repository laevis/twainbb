/*───────────────────────────────────────────────────────────────────────────*\
 │  Copyright (C) 2014 eBay Software Foundation                                │
 │                                                                             │
 │hh ,'""`.                                                                    │
 │  / _  _ \  Licensed under the Apache License, Version 2.0 (the "License");  │
 │  |(@)(@)|  you may not use this file except in compliance with the License. │
 │  )  __  (  You may obtain a copy of the License at                          │
 │ /,'))((`.\                                                                  │
 │(( ((  )) ))    http://www.apache.org/licenses/LICENSE-2.0                   │
 │ `\ `)(' /'                                                                  │
 │                                                                             │
 │   Unless required by applicable law or agreed to in writing, software       │
 │   distributed under the License is distributed on an "AS IS" BASIS,         │
 │   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  │
 │   See the License for the specific language governing permissions and       │
 │   limitations under the License.                                            │
 \*───────────────────────────────────────────────────────────────────────────*/
'use strict';

var path = require('path'),
    util = require('./lib/util'),
    assert = require('assert');


var proto = {

    get fallbackLocale() {
        return this._fallback;
    },

    _locate: function (name, locale) {
        var relative = path.join(this._root, locale.country, locale.language);
        var val = util.locate(name, this._root, relative);

        if (!val.file) {
            relative = path.join(this._root, this._fallback.country, this._fallback.language);
            val = util.locate(name, this._root, relative);
        }

        return val;
    },

    /**
     * Finds a file that matches the provided name, falling back to a root directory.
     * @param name
     * @param locale
     * @returns {*}
     */
    resolve: function (name, locale) {
        var match, loc;
        name = name + this._ext;
        loc = locale ? util.parseLangTag(locale) : this._fallback;
        match = this._locate(name, loc);
        return match;
    }

};

exports.create = function (options) {
    var ext;
    options = options || {};
    assert(options.root, 'root is not defined. A root directory must be specified.');
    assert(options.ext, 'ext is not defined. A file extension is required.');

    ext = options.ext;
    if (ext[0] !== '.') {
        ext = '.' + ext;
    }
    return Object.create(proto, {
        _root: {
            value: options.root
        },
        _fallback: {
            value: util.parseLangTag(options.fallback)
        },
        _ext: {
            value: ext
        }
    });
};
