'use strict';

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
    https_port: 50511
};