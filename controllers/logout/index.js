'use strict';

var session = require('express-session');

module.exports = function (router) {
    router.get('/', function (req, res, next) {
        req.session.userId = undefined;
        res.redirect('/');
    });
};
