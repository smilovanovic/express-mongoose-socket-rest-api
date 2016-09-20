var express = require('express');
var publicRouter = express.Router();
var privateRouter = express.Router();
var fs = require('fs');
var _ = require('underscore');
var userModel = require('./models/userModel');

privateRouter.use(checkAccessToken);

fs.readdir(__dirname + '/routes/', function(err, files) {
    for(var i = 0; i < files.length; i++) {
        var ctrl = require('./routes/' + files[i]);
        _.each(ctrl, function(ep) {
            if(!ep.param) {
                var handles = ep.middlewares ? ep.middlewares: [];
                handles.push(ep.handle);
                if(!ep.public) {
                    privateRouter.route(ep.route)[ep.type](handles);
                } else {
                    publicRouter.route(ep.route)[ep.type](handles);
                }
            } else {
                privateRouter.param(ep.param, ep.handle);
            }
        });
    }
});

exports.publicRouter = publicRouter;
exports.privateRouter = privateRouter;

function checkAccessToken(req, res, next) {
    var tok = req.headers.access_token || req.query.access_token;
    if(!tok) return next({message: 'No access token', status: 401});
    userModel.checkToken(tok).then(function(user) {
        var io = require('socket-events');
        req.socket = _.find(io.of('/').connected, function(v, k) {return v.user && v.user._id.toString() == user._id.toString()});
        req.user = user;
        next();
    }, function(err) {
        next(err);
    });
}