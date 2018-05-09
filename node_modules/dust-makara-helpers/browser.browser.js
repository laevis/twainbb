/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var common = __webpack_require__(1);

	module.exports = function(dust, options) {
	    options = options || {};

	    common(dust, function () {}, options, options.loader);
	};

	module.exports.registerWith = module.exports;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var usecontent = __webpack_require__(2);
	var message = __webpack_require__(3);
	var iferr = __webpack_require__(4);

	module.exports = function(dust, debug, options, loader) {
	    options = options || {};

	    debug("registering");

	    // Default to true, but since it imposes some complexity and lack of clarity,
	    // about where things come from in the templates, allow it to be disabled.
	    var autoloadTemplateContent = options.autoloadTemplateContent == null || options.autoloadTemplateContent;

	    debug("will autoload template content? %j", autoloadTemplateContent);

	    usecontent.withLoader(loader).registerWith(dust);

	    // The message helper is the main user surface from the template side.
	    message.registerWith(dust, { enableMetadata: options.enableMetadata });

	    // Here's where the dirty bit of auto-wrapping templates with the content
	    // load is triggered.
	    if (autoloadTemplateContent) {
	        wrapOnLoad(dust, loader, debug);
	    }
	};

	function hackGibson(ctx, content, bundle) {
	    var oldShiftBlocks = ctx.shiftBlocks;
	    var oldPush = ctx.push;

	    // Alter the context to wrap each block shifted, so content will be
	    // present even in blocks rendered from other templates like layouts.
	    ctx.shiftBlocks = function(locals) {
	        return oldShiftBlocks.call(this, objMap(locals, function (l) {
	            return wrapBlock(l, content, bundle);
	        }));
	    };

	    // Alter the context to apply this same alteration to each context
	    // pushed below this one, maintaining this hack for all future
	    // context pushes.
	    ctx.push = function(/* head, idx, len */) {
	        var newCtx = oldPush.apply(this, arguments);
	        hackGibson(newCtx, content, bundle);
	        return newCtx;
	    };
	}

	function wrapBlock(block, content, bundle) {
	    // Return a block that re-pushes the content, and then passes to
	    // the original block. This makes sure the content is associated
	    // with the auto-loaded content bundle, not coming from the calling
	    // context, which could be a different template and have the wrong
	    // content loaded.
	    return function (chunk, ctx) {
	        ctx = ctx.push({intl: { messages: content, bundle: bundle }});
	        return block(chunk, ctx);
	    };
	}

	function objMap(obj, fn) {
	    var n = {};
	    Object.keys(obj).forEach(function (e) {
	        n[e] = fn(obj[e]);
	    });
	    return n;
	}

	// This is where the magic lies. To get a hook on templates and wrap them with
	// javascript that is aware of the template's name
	function wrapOnLoad(dust, loader, debug) {
	    var oldOnLoad = dust.onLoad;

	    if (!oldOnLoad) {
	        throw new Error("dust.onLoad must be configured to use automatic content loading");
	    }

	    debug("wrapping onLoad function to support content autoloading");

	    dust.onLoad = function(name, options, cb) {

	        var ourLoader = iferr(cb, function (srcOrTemplate) {
	            debug("got template %s", srcOrTemplate);

	            var tmpl = getTemplate(srcOrTemplate);
	            if (!tmpl) {
	                debug("Compiling template '%s'", name);
	                tmpl = dust.loadSource(dust.compile(srcOrTemplate, name));
	            }

	            if (tmpl.loadsDefaultContent) {
	                newTmpl = tmpl;
	            } else {
	                debug("wrapping template '%s' to look up default content", tmpl.templateName);
	                var newTmpl = function (chunk, ctx) {
	                    return chunk.map(function (chunk) {
	                        var bundle = tmpl.templateName + '.properties';

	                        loader(ctx, bundle, function (err, content) {
	                            if (err) {
	                                chunk.setError(err);
	                            } else {
	                                hackGibson(ctx, content, bundle);
	                                dust.helpers.useContent(chunk, ctx, { block: tmpl }, { bundle: bundle }).end();
	                            }
	                        });
	                    });
	                };
	                newTmpl.templateName = tmpl.templateName;
	                newTmpl.loadsDefaultContent = true;
	                newTmpl.__dustBody = true;
	            }

	            if (dust.config.cache) {
	                // This actually replaces the template registered by
	                // compiling and loading above.
	                dust.cache[tmpl.templateName] = newTmpl;
	            }

	            cb(null, newTmpl);
	        });

	        debug("calling old onLoad to get template '%s'", name);
	        if (oldOnLoad.length === 2) {
	            return oldOnLoad.call(this, name, ourLoader);
	        } else {
	            return oldOnLoad.call(this, name, options, ourLoader);
	        }
	    };

	    /**
	     * Extracts a template function (body_0) from whatever is passed.
	     *
	     * This is an extract of the same function from the dustjs source.
	     *
	     *  nameOrTemplate Could be:
	     *   - the name of a template to load from cache
	     *   - a CommonJS-compiled template (a function with a `template` property)
	     *   - a template function
	     * returns a template function, if found
	     */
	    function getTemplate(nameOrTemplate) {
	        if(!nameOrTemplate) {
	            return null;
	        }
	        if(typeof nameOrTemplate === 'function' && nameOrTemplate.template) {
	            // Sugar away CommonJS module templates
	            return nameOrTemplate.template;
	        }
	        if(dust.isTemplateFn(nameOrTemplate)) {
	            // Template functions passed directly
	            return nameOrTemplate;
	        }
	    }
	}


/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function (lookup) {

	    if (typeof lookup !== 'function' || lookup.length !== 3) {
	        throw new TypeError("lookup function must be in the form function(context, bundle, callback) { ... }");
	    }

	    var registerWith = function registerWith(dust) {
	        dust.helpers.useContent = useContent;
	    };

	    registerWith.registerWith = registerWith;

	    return registerWith;

	    function useContent(chunk, ctx, bodies, params) {
	        if (!bodies.block) {
	            return chunk;
	        }

	        return chunk.map(function (chunk) {
	            lookup(ctx, params.bundle, function (err, content) {
	                if (err) {
	                    chunk.setError(err);
	                } else {
	                    ctx = ctx.push({ intl: { messages: content, bundle: params.bundle } });
	                    bodies.block(chunk, ctx).end();
	                }
	            });
	        });
	    }
	};

	module.exports.withLoader = module.exports;


/***/ },
/* 3 */
/***/ function(module, exports) {

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


/***/ },
/* 4 */
/***/ function(module, exports) {

	// Generated by CoffeeScript 1.7.1
	(function() {
	  var exports, iferr, printerr, throwerr, tiferr,
	    __slice = [].slice;

	  iferr = function(fail, succ) {
	    return function() {
	      var a, err;
	      err = arguments[0], a = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
	      if (err != null) {
	        return fail(err);
	      } else {
	        return typeof succ === "function" ? succ.apply(null, a) : void 0;
	      }
	    };
	  };

	  tiferr = function(fail, succ) {
	    return iferr(fail, function() {
	      var a, err;
	      a = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	      try {
	        return succ.apply(null, a);
	      } catch (_error) {
	        err = _error;
	        return fail(err);
	      }
	    });
	  };

	  throwerr = iferr.bind(null, function(err) {
	    throw err;
	  });

	  printerr = iferr(function(err) {
	    return console.error(err.stack || err);
	  });

	  module.exports = exports = iferr;

	  exports.iferr = iferr;

	  exports.tiferr = tiferr;

	  exports.throwerr = throwerr;

	  exports.printerr = printerr;

	}).call(this);


/***/ }
/******/ ]);