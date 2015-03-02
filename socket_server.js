var dgram = require('dgram');
var events = require('events');
var fs = require('fs');
var http = require('http');
var io = require('socket.io');

var UDP_HOST = '127.0.0.1',
    UDP_PORT = 8888,
    SERVER_HOST = '127.0.0.1',
    SERVER_PORT = 8880,
    HTDOCS_PATH = '/htdocs';



/**
 * A client of the UDP server that will be broadcasting packets of
 * channel data from the OpenBCI board.
 * @param {number} port The port to connect to.
 * @param {string} host The host to connect to.
 * @constructor
 */
function UDPClient(port, host) {
  this.port = port;
  this.host = host;
  this.data = [];
  this.events = new events.EventEmitter();
  this.connection = dgram.createSocket('udp4');
  this.connection.on('listening', this.onListening.bind(this));
  this.connection.on('message', this.onMessage.bind(this));
  this.connection.bind(this.port, this.host);
};


/**
 * Handler for when the connection is opened.
 */
UDPClient.prototype.onListening = function() {
  console.log('Listening for data...');
};


/**
 * Handler for when a message is received.
 * @param {string} message The message that was received.
 */
UDPClient.prototype.onMessage = function(msg) {
  this.events.emit('sample', JSON.parse(msg.toString()));
};



function OpenBCIServer(host, port, htdocs) {
  this.host = host;
  this.port = port;
  this.server = http.createServer(this.onRequest.bind(this));
  this.socket = io.listen(this.server, { log: false });
  this.htdocs = htdocs;

  this.socket.on('connection', this.onSocketConnect.bind(this));
  this.server.listen(this.port, this.host)
};

OpenBCIServer.prototype.onRequest = function(req, res) {
  this.serveStatic(req, res);
};

OpenBCIServer.prototype.serveStatic = function(req, res) {
  var file = req.url;
  if (file == '/') {
    file = '/index.html';
  }
  fs.readFile(__dirname + this.htdocs + file,
      function(err, data) {
        if (err) {
          console.log(err);
          res.writeHead(500);
          return res.end('Error loading index.html');
        }

        res.writeHead(200);
        res.end(data);
      });
};

OpenBCIServer.prototype.onSocketConnect = function(socket) {
  console.log('Client connected!');
};

var client = new UDPClient(UDP_PORT, UDP_HOST);
var server = new OpenBCIServer(SERVER_HOST, SERVER_PORT, HTDOCS_PATH);

client.events.on('sample', function(data) {
  server.socket.sockets.emit('openbci', data);
});
