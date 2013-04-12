require('colors');

var webRTC  = require('webrtc.io').listen(8001);
var express = require('express');
var server  = new express


server.configure(function() {
  server.use(express.cookieParser());
  server.use(express.bodyParser());
  server.use(express.session({ secret: (process.env['SESSION-SECRET'] || 'this is annoying ok great') }));
  server.use(server.router);
  server.set('views', __dirname + "/views");
  server.set("view engine", "jade");
  server.use(express.static(__dirname + "/public"));
});

webRTC.on('connection', function() {
  console.log("new RTC connection".green + " " + new Date);
});

server.get("/", function(req, res) {
  res.render("index");
});

server.listen(3000);
console.log("HTTP Started".yellow);
