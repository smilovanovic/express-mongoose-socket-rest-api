var _ = require('underscore');
var Q = require('q');
var nodemailer = require('nodemailer');

exports.sendMail = function(smtp, receiver_email, subject, html, attachments) {
    return Q.Promise(function(resolve, reject) {
        if(!smtp || _.isEmpty(smtp)) return reject({message: 'Please setup SMTP settings.'});
        if (!receiver_email || _.isEmpty(receiver_email)) return reject({message: 'Please setup receiver email address.'});
        var transporter = nodemailer.createTransport(smtp);
        var mailOptions = {
            from: smtp.auth.user + ' <' + smtp.auth.user + '>',
            to: receiver_email + ' <' + receiver_email + '>',
            subject: subject,
            html: html
        };
        if(attachments) {
            mailOptions.attachments = attachments;
        }
        transporter.sendMail(mailOptions, function(error, info){
            if(error) return reject(error);
            resolve(info);
        });
    });
};

