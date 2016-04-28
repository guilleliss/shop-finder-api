var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');

var GooglePlaces = require('google-places');
var places = new GooglePlaces('AIzaSyCAPKkCs0gnsuZia_W_d7oZn8hx-xkJGW0');

require('./db');

var api_auth = require('./routes/api_auth');
var api_shops = require('./routes/api_shops');
var api_users = require('./routes/api_users');
var api_settings = require('./routes/api_settings');
var index = require('./routes/index');

var app = express();

app.set('superSecret', 'barkalastudios');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(__dirname + '/public/images/favicon.png'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(__dirname + '/public/ios.log', {flags: 'a'});

// setup the logger
app.use(logger('combined', {
    stream: accessLogStream,
    skip: function (req, res) { 
        return !req.headers['user-agent'].includes('OS Version'); 
    }
}));

app.use('/api', api_auth);
app.use('/api', api_shops);
app.use('/api/users', api_users);
app.use('/api/settings', api_settings);
app.use('/', index);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500)
        .send({
            status: 500, 
            message: err.message, 
            type: 'internal',
            code: err.code
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send(500, {
        status: 500, 
        message: err.message, 
        type: 'internal',
        code: err.code
    });
});

module.exports = app;
