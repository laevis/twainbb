'use strict';

var path = require('path');
var db = require(path.resolve('database'));
var passwordHash = require('password-hash');
var formatUnicorn = require('format-unicorn');
var i18n = require(path.resolve('helpers/i18n.js'));
var session = require('express-session');

module.exports = function(router) {
    router.put('/', function(req, res) {
        db.getOneWhere('users', 'username', req.body.username, ["password"]).then(result => {
            if(result[0] != undefined) {
                 res.status(400).json({success: false, result: i18n.gettext('api:users:put:username_unavailable')});
            } else {
                db.getOneWhere('users', 'email', req.body.email, ["email"]).then(mresult => {
                    if(mresult[0] != undefined) {
                         res.status(400).json({success: false, result: i18n.gettext('api:users:put:email_unavailable')});
                    } else {
                        db.insert('users', {
                            username: req.body.username,
                            displayname: req.body.displayname,
                            password: passwordHash.generate(req.body.password),
                            email: req.body.email,
                            createdAt: new Date(),
                            validatedAt: null,
                            avatar: null,
                        }).then(result => {
                            if(result.errors > 0) {
                                res.status(400).json({success: false, result: i18n.gettext('api:users:put:error').formatUnicorn({username: req.body.username, time: new Date()})});
                            } else {
                                res.status(200).json({success: true, result: i18n.gettext('api:users:put:success').formatUnicorn({username: req.body.username, time: new Date()})});
                            }
                        });
                    }
                });
            }
        });
    });

    router.post('/', function(req, res) {
        db.getOneWhere('users', 'username', req.body.username, ["id", "username", "password"]).then(result => {
            if(result[0] == undefined) {
                res.status(400).json({success: false, result: i18n.gettext('api:users:post:invalid_parameters')});
            } else {
                if(passwordHash.verify(req.body.password, result[0].password)) {
                    if(req.body.token == undefined && req.session.userId == undefined) req.session.userId = result[0].id;
                    res.status(200).json({success: true, result: i18n.gettext('api:users:post:authentication_successful')});
                } else {
                    res.status(400).json({success: false, result: i18n.gettext('api:users:post:authentication_failed')});
                }
            }
        });
    });
}
