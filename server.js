var webRTC = require('webrtc.io').listen(8001);


webRTC.on('connection', function() {
  console.log("new connection");
});

console.log("server listening");
