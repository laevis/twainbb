'use strict';

var mb = require('makara-browserify');
var path = require('path');

module.exports = function (grunt) {
    grunt.registerTask('makara-browserify', 'Write out browserify i18n bundles', function () {
        mb.build(this.options().appRoot || process.cwd(), this.async());
    });
};
