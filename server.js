#!/usr/bin/env NODE_ENV=development nodemon
var debug = require('debug')('alpha'),
	app = require('./app'),
	config = require('./config');


if (app.get('env') === 'production') {
	var https = require('https');
	var http = require('http');
	var fs = require('fs');
	var options = {
		key: fs.readFileSync('/etc/apache2/ssl/private.key'),
		cert: fs.readFileSync('/etc/apache2/ssl/public.crt'),
		passphrase: 'miff2048KLM@'
	};
	var server = https.createServer(options, app).listen(config.https_port);
	http.createServer(app).listen(app.get('port'));
} else {
	var server = app.listen(app.get('port'), function() {
		debug('Express server listening on port ' + server.address().port);
	});
}
module.exports = server;
require('./socket-events');