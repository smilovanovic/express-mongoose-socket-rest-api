var express = require('express'),
    path = require('path'),
    logger = require('morgan'),
    compression = require('compression'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    config = require('./config'),
    mongoose = require('mongoose'),
    cors = require('cors'),
    _ = require('underscore');
mongoose.Promise = require('q').Promise;
mongoose.connect(config.db.mongo.uri, config.db.mongo.options);
mongoose.connection.on('connected', function() {
    console.log('Mongoose connected');
});
mongoose.connection.on('disconnected', function() {console.log('Mongoose disconnected');});
mongoose.connection.on('error', function(err) {
    console.log('Mongoose error');
    console.log(err);
    process.exit();
});

var router = require('./router.js');
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(cors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": true
}));
app.options('*', cors());
app.use(compression());
// if(app.get('env') === 'development') {
    app.use(logger('dev'));
// }
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
var cacheOptions = {};
// if(app.get('env') !== 'development') {
//     cacheOptions = {maxAge: 86400000*7};
// }

app.use(router.publicRouter);
app.use(router.privateRouter);

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) {
    if(err) {
        var resp = {
            message: err.message,
            duration: err.duration ? err.duration : 2000
        };
        if(!err.status) {
            res.status(400);
            console.error({
                timestamp: new Date(),
                user: req.user ? {_id: req.user._id} : null,
                clinic: req.clinic ? {_id: req.clinic._id} : null,
                stack: err.stack,
                message: err.message
            });
            if(err.errors) {
                resp.message = _.map(err.errors, function(v) {return v.message}).join(' ');
            }
            if(app.get('env') !== 'production') {
                resp.error = err;
            }
        } else {
            res.status(err.status);
            resp.error = err;
        }
        res.send(resp);
    }
});

app.set('port', process.env.PORT || config.port);
module.exports = app;
