"use strict";

var build = require('./build');

build(process.argv[2], function (err) {
    if (err) {
        console.warn(err);
        process.exit(1);
    }
});
