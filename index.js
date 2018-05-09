'use strict';

var express = require('express');
var kraken = require('kraken-js');
var i18n = require('./helpers/i18n.js')
var validate = require('./helpers/validation.js')
var bodyParser = require('body-parser');
var session = require('express-session');

var options, app;

options = {
    onconfig: function (config, next) {
        next(null, config);
    }
};

app = module.exports = express();
app.use(kraken(options));

app.use(session({
  secret: 'some random string which can be set in the config',
  resave: true,
  saveUninitialized: false
}));

app.use(function (req, res, next) {
    var translate = function(trans) {
        return i18n.gettext(trans);
    }

    res.locals.isLoggedIn = !!req.session.userId;
    res.locals._ = translate;
    
    next();
});


app.use('/api/*', bodyParser.json(), function (req, res, next) {
    validate(req, res, function(err, response) {
        if (err) {
            res.status(400).json({success: false, result: response});
        } else {
            next();
        }
    });
});

app.on('start', function () {
    console.log('Application ready to serve requests.');
    console.log('Environment: %s', app.kraken.get('env:env'));
});
