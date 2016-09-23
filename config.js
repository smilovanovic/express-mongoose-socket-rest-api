'use strict';
var fs = require('fs');

module.exports = {
    db: {
        mongo: {
            uri: 'mongodb://localhost/',
            options: {
                user: '',
                pass: '',
                auth: {
                    authSource: 'admin'
                }
            }
        }
    },
    mail: {
        auth: {
            user: '',
            pass: ''
        },
        port: 465,
        host: 'smtp.gmail.com',
        secure: true,
        tls: {rejectUnauthorized: false}
    },
    _SALT: "",
    port: 3001,
    https_port: undefined,
    https_options: {
        key: fs.readFileSync(''), // example /etc/apache2/ssl/private.key
        cert: fs.readFileSync(''), // example /etc/apache2/ssl/public.crt
        passphrase: ''
    }
};