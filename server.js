require('colors');

var ws      = require('websocket.io');
var express = require('express');
var uid     = require('node-uuid');
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

server.get("/", function(req, res) {
  res.render("index");
});

server.listen(8001);
console.log("HTTP Started".yellow);

var io            = ws.listen(8000);
    io.s_clients  = {};

io.on('connection', function(socket) {
  console.log("new socket connection");
  socket.id   = uid.v1();
  socket.room =  "test";
  io.s_clients[socket.id] = socket;

  socket.send(JSON.stringify({
    type: "assigned_id",
    id: socket.id
  }));

  socket.on('message', function(d){switchBox(d, socket)});
});

function switchBox(d, socket) {
  d = JSON.parse(d);
  switch(d.type){
    case "received_offer":
    case "received_candidate":
    case "received_answer":
      var _keys = Object.keys(io.s_clients);
      for(var i = 0; i < _keys.length; ++i) {
        if (_keys[i] != d.id) {
          io.s_clients[_keys[i]].send(JSON.stringify(d));
        }
      }
      console.log(d.type+"".yellow);
    break;
    case "close":
      console.log("socket closing".yellow);
      socket.close();
      if (d.data && d.data.id) {
        delete io.s_clients[d.data.id]
      } else {
        console.log("no id passed to close".red);
      }
    break;
    default:
      console.log("unknown type ".red + " " + d.type);
  }
}
