var mongoose = require('mongoose');
var UserModel = require('./userModel');
var Q = require('q');
var sha1 = require('sha1');
var moment = require('moment');
var fs = require('fs');
var path = require('path');
var ejs = require('ejs');
var config = require('../config');
var box = require('../box');

var UserTemporaryPasswordSchema = mongoose.Schema({
    password: {type: String, required: true},
    create_date: {type: Date, default: Date.now},
    expiry_date: {type: Date, required: true},
    _user: {type: mongoose.Schema.Types.ObjectId, ref:'UserModel'}
}, { collection: 'user_temporary_passwords', versionKey: false});

UserTemporaryPasswordSchema.statics.vcCreate = function(user, send_email) {
    return Q.Promise(function(resolve, reject) {
        UserTemporaryPasswordModel.find({_user: user._id, create_date: {$gte: moment().subtract(5, 'minutes').toDate()}}).count().exec().then(function(c) {
            if(c > 5) return reject({message: 'Too many attempts in the last 5min'});
            require('crypto').randomBytes(8, function(err, buffer) {
                if(err) return reject(err);
                var password = buffer.toString('hex');
                UserTemporaryPasswordModel.create({
                    password: sha1(config._SALT + password),
                    expiry_date: moment().add(20, 'minutes').toDate(),
                    _user: user._id
                }).then(function(p) {
                    if(!send_email) return resolve({password: password});
                    fs.readFile(path.resolve(__dirname, '../views/forgot_pass.html'), 'utf8', function(err, tplPageMail) {
                        if (err) return reject(err);
                        var html = ejs.render(tplPageMail, {password: password});
                        box.sendMail(config.mail, user.email, 'VetCloud forgot password', html).then(function(info) {
                            resolve({success: true});
                        }, function(err) {
                            reject(err);
                        });
                    });
                }, function(err) {
                    reject(err);
                });
            });
        }, function(err) {
            reject(err);
        });
    });
};

var UserTemporaryPasswordModel = mongoose.model('UserTemporaryPasswordModel', UserTemporaryPasswordSchema);
module.exports = UserTemporaryPasswordModel;