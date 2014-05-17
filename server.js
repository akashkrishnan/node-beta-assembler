var Config = require('./config.js');
var express = require('express');

// Configure the server
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server, { log: false });

// Configure Express
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// Add Express middleware
app.use(express.static(__dirname + '/public'));

// Set up Express routes
require('./routes.js')(app, io.sockets);

// Set up Socket.IO
io.sockets.on('connection', require('./socket.js')(io.sockets));

// Start the server
server.listen(Config.web.port, function () {
  console.log('Listening on port ' + Config.web.port + '.');
});
