/**
 * Module dependencies.
 */

var express = require('express'),
  app = express.createServer(),
  io = require('socket.io').listen(app),
  router = require('./router'),
  config = require('./config').config,
  fs = require('fs');

module.exports = app;

var logFile = fs.createWriteStream(config.loggerFile, {
  flags: 'a+'
});
// Configuration
app.configure(function() {

  app.use(express.methodOverride());
  app.use(express.bodyParser());
	// because of not using these things, so comment them.
  //app.use(express.cookieParser());
  //app.use(express.session({secret:config.session_secret}));
  app.use(app.router);
  app.use(express.logger({
    stream: logFile
  }));
  app.use(express.static(__dirname + '/public'));
  //console.log('config happen');
});

app.configure('development', function() {
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true,
  }));
});

app.configure('production', function() {
  app.use(express.errorHandler());
});

// Routes
router(app, io);
//app listen port
app.listen(config.port);

console.log("Express server listening on port %d in %s mode", config.port, app.settings.env);
