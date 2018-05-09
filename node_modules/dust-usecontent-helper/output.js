define(function() { return /******/ (function(modules) { // webpackBootstrap
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


/***/ }
/******/ ])});;