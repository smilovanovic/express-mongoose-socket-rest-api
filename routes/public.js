var userModel = require('../models/userModel.js');
var userTemporaryPasswordModel = require('../models/userTemporaryPasswordModel.js');

exports.signup = {
    route: '/signup',
    type: 'post',
    public: true,
    handle: function(req, res, next) {
        userModel.signup(req.body.full_name, req.body.email, req.body.password).then(function(data) {
            res.json(data);
        }, function(err) {
            next(err);
        });
    }
};

exports.authenticate = {
    route: '/authenticate',
    type: 'post',
    public: true,
    handle: function(req, res, next) {
        if(!req.body.email || !req.body.password) return next({message: 'Email or password missing'});
        userModel.login(req.body.email, req.body.password).then(function(data) {
            res.json(data);
        }, function(err) {
            next(err);
        });
    }
};

exports.forgotPassword = {
    route: '/forgot-password',
    type: 'post',
    public: true,
    handle: function(req, res, next) {
        if(!req.body.email) return next({message: 'Email is required'});
        userModel.findOne({email: req.body.email}).exec().then(function(usr) {
            if(!usr) return next({message: 'User not found'});
            userTemporaryPasswordModel.vcCreate(usr, true).then(function(resp) {
                res.json(resp);
            }, function(err) {
                return next(err);
            });
        }, function(err) {
            return next(err);
        });
    }
};
