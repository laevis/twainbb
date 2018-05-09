'use strict';

var path = require('path');
let IndexModel = require('../models/index');
let i18n = require('../helpers/i18n.js');
var server = require('../server');
var r = require('rethinkdb');
var session = require('express-session');

module.exports = function (router) {
    router.get('/', function (req, res, next) {
        IndexModel().then(result => {
            res.render('index', result);
            server.io.emit('all posts', result);

            let conn = r.connect({host: '127.0.0.1', port: 28015}, function(err, conn) {
                r.db('twainbb').table('topics').changes().run(conn, function(err, cursor) {
                    if (err) throw err;
                    cursor.each(function(err, row) {
                        if (err) throw err;
                        io.emit('new post', JSON.stringify(row, null, 2));
                    });
                });
            });
        });
    });
};
