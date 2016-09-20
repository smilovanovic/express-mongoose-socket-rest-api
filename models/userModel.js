var mongoose = require('mongoose');
var UserTemporaryPasswordModel = require('./userTemporaryPasswordModel');
var config = require('../config');
var jwt = require('jsonwebtoken');
var moment = require('moment');
var sha1 = require('sha1');
var Q = require('q');
var _ = require('underscore');

var UserSchema = mongoose.Schema({
	full_name: {type: String, required: true},
	email: String,
	active: { type: Boolean, default: true },
	password: String
}, { collection: 'users', versionKey: false});

UserSchema.statics.login = function(email, password) {
    return Q.Promise(function(resolve, reject) {
        UserModel.findOne({email: email}).exec().then(function (user) {
            if (user == null) return reject({message: 'Email or password incorect'});
            var encodedPass = sha1(config._SALT + password);
            var passPromise = user.password == encodedPass ? Q.resolve({password: user.password}) : UserTemporaryPasswordModel.findOne({_user: user._id, password: encodedPass, expiry_date: {$gte: moment().toDate()}}).exec();
            passPromise.then(function(pass) {
                if(!pass || (pass && pass.password != encodedPass)) return reject({message: 'Email or password incorect'});
                if (!user.active) return reject({message: 'User account not activated or login disabled'});
                resolve({
                    user: user,
                    access_token: jwt.sign({
                        _user: user._id
                    }, config._SALT, {expiresIn: '1d'})
                });
            }, function(err) {
                reject(err);
            });
        }, function(err) {
            reject(err);
        });
    });
};

UserSchema.statics.signup = function(full_name, email, password) {
    return Q.Promise(function(resolve, reject) {
        if(!full_name || !email || !password) return reject({message: 'Invalid submit'});
        UserModel.create({
            full_name: full_name,
            email: email,
            password: sha1(config._SALT + password)
        }).then(function (user) {
            resolve(user);
        }, function(err) {
            reject(err);
        });
    });
};

UserSchema.statics.checkToken = function(token) {
    return Q.Promise(function(resolve, reject) {
        jwt.verify(token, config._SALT, function(err, decoded_token) {
            if(err) return reject(err);
            UserModel.findOne({_id: decoded_token._user}).exec().then(function(user) {
                if(!user) return reject({message: 'User not found', status: 401});
                if(!user.active) return reject({message: 'User account not activated', status: 401});
                resolve(user);
            }, function(err) {
                reject(err);
            });
        });
    });
};

var UserModel = mongoose.model('UserModel', UserSchema);
module.exports = UserModel;