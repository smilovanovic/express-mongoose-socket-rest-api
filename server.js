#!/usr/bin/env NODE_ENV=development nodemon
var debug = require('debug')('alpha'),
	app = require('./app'),
	config = require('./config');

var server;

if (app.get('env') === 'production' && config.https_port && config.https_options.passphrase) {
	var https = require('https');
	var http = require('http');
	server = https.createServer(config.https_options, app).listen(config.https_port);
	http.createServer(app).listen(app.get('port'));
} else {
	server = app.listen(app.get('port'), function() {
		debug('Express server listening on port ' + server.address().port);
	});
}
module.exports = server;
require('./socket-events');